#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { program } from 'commander';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Configure the CLI
program
  .name('sync-github')
  .description('Sync DropFlow Pro with GitHub repository')
  .option('-p, --push', 'Push changes to GitHub')
  .option('-l, --pull', 'Pull changes from GitHub')
  .option('-b, --branch <branch>', 'Branch to sync with', 'main')
  .option('-r, --repo <repo>', 'GitHub repository', 'dropflow-pro/dropflow-pro')
  .option('-f, --force', 'Force push/pull', false)
  .option('-m, --message <message>', 'Commit message', 'Sync: Update files')
  .parse(process.argv);

const options = program.opts();

// Main function
async function main() {
  console.log('🔄 DropFlow Pro GitHub Sync Tool');
  
  // Check if git is installed
  try {
    execSync('git --version', { stdio: 'ignore' });
  } catch (error) {
    console.error('❌ Git is not installed or not in PATH');
    process.exit(1);
  }
  
  // Check if we're in a git repository
  let isGitRepo = false;
  try {
    execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' });
    isGitRepo = true;
  } catch (error) {
    isGitRepo = false;
  }
  
  // Initialize git repository if needed
  if (!isGitRepo) {
    console.log('📁 Initializing git repository...');
    execSync('git init');
    execSync(`git remote add origin https://github.com/${options.repo}.git`);
  }
  
  // Get current branch
  let currentBranch;
  try {
    currentBranch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
  } catch (error) {
    // If this fails, we might be in a new repo with no commits
    currentBranch = 'main';
  }
  
  console.log(`📂 Current branch: ${currentBranch}`);
  
  // Switch to target branch if needed
  if (currentBranch !== options.branch) {
    console.log(`🔀 Switching to branch: ${options.branch}`);
    
    // Check if branch exists
    const branches = execSync('git branch').toString();
    if (branches.includes(options.branch)) {
      execSync(`git checkout ${options.branch}`);
    } else {
      // Create branch if it doesn't exist
      execSync(`git checkout -b ${options.branch}`);
    }
  }
  
  // Pull changes
  if (options.pull) {
    pullChanges();
  }
  
  // Push changes
  if (options.push) {
    pushChanges();
  }
  
  // If no action specified, show help
  if (!options.pull && !options.push) {
    console.log('❓ No action specified. Use --push or --pull to sync changes.');
    program.help();
  }
}

// Pull changes from GitHub
function pullChanges() {
  try {
    console.log('⬇️ Pulling changes from GitHub...');
    
    const pullCommand = options.force 
      ? `git pull --force origin ${options.branch}` 
      : `git pull origin ${options.branch}`;
    
    execSync(pullCommand, { stdio: 'inherit' });
    console.log('✅ Changes pulled successfully');
  } catch (error) {
    console.error('❌ Error pulling changes:', error.message);
    
    // Check if there are conflicts
    const status = execSync('git status').toString();
    if (status.includes('Unmerged paths') || status.includes('fix conflicts')) {
      console.error('❗ Merge conflicts detected. Please resolve them manually.');
    }
    
    process.exit(1);
  }
}

// Push changes to GitHub
function pushChanges() {
  try {
    // Check for changes
    const status = execSync('git status --porcelain').toString();
    
    if (status.length === 0) {
      console.log('✅ No changes to push');
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
    
    // Push changes
    const pushCommand = options.force 
      ? `git push --force origin ${options.branch}` 
      : `git push origin ${options.branch}`;
    
    console.log(`🚀 Pushing to ${options.branch}...`);
    execSync(pushCommand, { stdio: 'inherit' });
    console.log('✅ Changes pushed successfully');
  } catch (error) {
    console.error('❌ Error pushing changes:', error.message);
    process.exit(1);
  }
}

// Run the main function
main().catch(error => {
  console.error('❌ Unhandled error:', error);
  process.exit(1);
});