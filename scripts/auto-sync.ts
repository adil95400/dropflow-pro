#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { program } from 'commander';

// Configure the CLI
program
  .name('auto-sync')
  .description('Automatically sync changes between local and remote repositories')
  .option('-p, --push', 'Push changes to remote repository')
  .option('-f, --force', 'Force push changes')
  .option('-b, --branch <branch>', 'Specify branch to push to', 'main')
  .option('-m, --message <message>', 'Commit message', 'Auto-sync: Update files')
  .option('-i, --interval <minutes>', 'Auto-sync interval in minutes (for watch mode)', '5')
  .option('-w, --watch', 'Watch for changes and sync automatically')
  .parse(process.argv);

const options = program.opts();

// Main function
async function main() {
  console.log('🔄 DropFlow Pro Auto-Sync Tool');
  
  try {
    // Check if git is installed
    execSync('git --version', { stdio: 'ignore' });
  } catch (error) {
    console.error('❌ Git is not installed or not in PATH');
    process.exit(1);
  }
  
  // Check if we're in a git repository
  try {
    execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' });
  } catch (error) {
    console.error('❌ Not in a git repository');
    process.exit(1);
  }
  
  // Get current branch
  const currentBranch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
  console.log(`📂 Current branch: ${currentBranch}`);
  
  if (options.watch) {
    console.log(`👀 Watching for changes (sync every ${options.interval} minutes)...`);
    watchAndSync(parseInt(options.interval));
  } else {
    await syncChanges();
  }
}

// Sync changes function
async function syncChanges() {
  try {
    // Check for changes
    const status = execSync('git status --porcelain').toString();
    
    if (status.length === 0) {
      console.log('✅ No changes to sync');
      return;
    }
    
    console.log('🔍 Changes detected:');
    console.log(status);
    
    // Add all changes
    execSync('git add .');
    console.log('✅ Added all changes to staging area');
    
    // Commit changes
    execSync(`git commit -m "${options.message}"`);
    console.log(`✅ Committed changes with message: "${options.message}"`);
    
    if (options.push) {
      // Pull latest changes first to avoid conflicts
      try {
        console.log('🔄 Pulling latest changes...');
        execSync(`git pull origin ${options.branch}`);
      } catch (error) {
        console.warn('⚠️ Failed to pull latest changes. There might be conflicts.');
      }
      
      // Push changes
      const pushCommand = options.force 
        ? `git push --force origin ${options.branch}` 
        : `git push origin ${options.branch}`;
      
      console.log(`🚀 Pushing to ${options.branch}...`);
      execSync(pushCommand);
      console.log('✅ Changes pushed successfully');
    }
  } catch (error) {
    console.error('❌ Error syncing changes:', error);
    process.exit(1);
  }
}

// Watch for changes and sync automatically
function watchAndSync(intervalMinutes: number) {
  // Initial sync
  syncChanges();
  
  // Set up interval for regular syncing
  setInterval(() => {
    console.log(`\n🕒 Auto-sync triggered (${new Date().toLocaleTimeString()})`);
    syncChanges();
  }, intervalMinutes * 60 * 1000);
}

// Run the main function
main().catch(error => {
  console.error('❌ Unhandled error:', error);
  process.exit(1);
});