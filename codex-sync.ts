#!/usr/bin/env node
/**
 * DropFlow Pro - Codex Sync Tool
 * 
 * This script synchronizes the codebase with the Codex repository.
 * It handles both pushing local changes to Codex and pulling updates from Codex.
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { program } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';

// Configure the CLI
program
  .name('codex-sync')
  .description('Synchronize DropFlow Pro with Codex repository')
  .option('-p, --push', 'Push changes to Codex')
  .option('-l, --pull', 'Pull changes from Codex')
  .option('-b, --branch <branch>', 'Branch to sync with', 'main')
  .option('-r, --repo <repo>', 'Codex repository', 'codex/dropflow-pro')
  .option('-f, --force', 'Force push/pull', false)
  .option('-m, --message <message>', 'Commit message', 'Sync: Update files')
  .option('-d, --dry-run', 'Dry run (no actual changes)', false)
  .parse(process.argv);

const options = program.opts();

// Main function
async function main() {
  console.log(chalk.blue('🔄 DropFlow Pro Codex Sync Tool'));
  console.log(chalk.blue('-----------------------------'));
  
  // Check if git is installed
  try {
    execSync('git --version', { stdio: 'ignore' });
  } catch (error) {
    console.error(chalk.red('❌ Git is not installed or not in PATH'));
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
    console.log(chalk.yellow('📁 Initializing git repository...'));
    
    if (options.dryRun) {
      console.log(chalk.yellow('[DRY RUN] Would initialize git repository'));
    } else {
      execSync('git init');
      execSync(`git remote add codex https://codex.dropflow.pro/${options.repo}.git`);
    }
  }
  
  // Get current branch
  let currentBranch;
  try {
    currentBranch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
  } catch (error) {
    // If this fails, we might be in a new repo with no commits
    currentBranch = 'main';
  }
  
  console.log(chalk.blue(`📂 Current branch: ${currentBranch}`));
  
  // Switch to target branch if needed
  if (currentBranch !== options.branch) {
    console.log(chalk.yellow(`🔀 Switching to branch: ${options.branch}`));
    
    if (options.dryRun) {
      console.log(chalk.yellow(`[DRY RUN] Would switch to branch: ${options.branch}`));
    } else {
      // Check if branch exists
      const branches = execSync('git branch').toString();
      if (branches.includes(options.branch)) {
        execSync(`git checkout ${options.branch}`);
      } else {
        // Create branch if it doesn't exist
        execSync(`git checkout -b ${options.branch}`);
      }
    }
  }
  
  // If no action specified, ask user
  if (!options.push && !options.pull) {
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          { name: 'Push changes to Codex', value: 'push' },
          { name: 'Pull changes from Codex', value: 'pull' },
          { name: 'Both (pull then push)', value: 'both' },
          { name: 'Cancel', value: 'cancel' }
        ]
      }
    ]);
    
    if (action === 'cancel') {
      console.log(chalk.blue('Operation cancelled'));
      process.exit(0);
    }
    
    if (action === 'push' || action === 'both') {
      options.push = true;
    }
    
    if (action === 'pull' || action === 'both') {
      options.pull = true;
    }
  }
  
  // Pull changes
  if (options.pull) {
    await pullChanges();
  }
  
  // Push changes
  if (options.push) {
    await pushChanges();
  }
  
  console.log(chalk.green('✨ Codex sync completed successfully!'));
}

// Pull changes from Codex
async function pullChanges() {
  const spinner = ora('Pulling changes from Codex...').start();
  
  try {
    if (options.dryRun) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
      spinner.succeed('[DRY RUN] Would pull changes from Codex');
      return;
    }
    
    const pullCommand = options.force 
      ? `git pull --force codex ${options.branch}` 
      : `git pull codex ${options.branch}`;
    
    execSync(pullCommand, { stdio: 'pipe' });
    spinner.succeed('Changes pulled successfully');
  } catch (error) {
    spinner.fail(`Error pulling changes: ${error.message}`);
    
    // Check if there are conflicts
    const status = execSync('git status').toString();
    if (status.includes('Unmerged paths') || status.includes('fix conflicts')) {
      console.error(chalk.red('❗ Merge conflicts detected. Please resolve them manually.'));
    }
    
    process.exit(1);
  }
}

// Push changes to Codex
async function pushChanges() {
  // Check for changes
  const status = execSync('git status --porcelain').toString();
  
  if (status.length === 0) {
    console.log(chalk.green('✅ No changes to push'));
    return;
  }
  
  console.log(chalk.blue('🔍 Changes detected:'));
  console.log(status);
  
  // Confirm push
  if (!options.dryRun) {
    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: 'Do you want to push these changes to Codex?',
        default: true
      }
    ]);
    
    if (!confirm) {
      console.log(chalk.blue('Push cancelled'));
      return;
    }
  }
  
  // Add all changes
  const addSpinner = ora('Adding changes...').start();
  
  if (options.dryRun) {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
    addSpinner.succeed('[DRY RUN] Would add all changes');
  } else {
    try {
      execSync('git add .');
      addSpinner.succeed('Added all changes to staging area');
    } catch (error) {
      addSpinner.fail(`Error adding changes: ${error.message}`);
      process.exit(1);
    }
  }
  
  // Commit changes
  const commitSpinner = ora('Committing changes...').start();
  
  if (options.dryRun) {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
    commitSpinner.succeed(`[DRY RUN] Would commit with message: "${options.message}"`);
  } else {
    try {
      execSync(`git commit -m "${options.message}"`);
      commitSpinner.succeed(`Committed changes with message: "${options.message}"`);
    } catch (error) {
      commitSpinner.fail(`Error committing changes: ${error.message}`);
      process.exit(1);
    }
  }
  
  // Push changes
  const pushSpinner = ora(`Pushing to ${options.branch}...`).start();
  
  if (options.dryRun) {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
    pushSpinner.succeed(`[DRY RUN] Would push to ${options.branch}`);
  } else {
    try {
      const pushCommand = options.force 
        ? `git push --force codex ${options.branch}` 
        : `git push codex ${options.branch}`;
      
      execSync(pushCommand, { stdio: 'pipe' });
      pushSpinner.succeed('Changes pushed successfully');
    } catch (error) {
      pushSpinner.fail(`Error pushing changes: ${error.message}`);
      process.exit(1);
    }
  }
}

// Run the main function
main().catch(error => {
  console.error(chalk.red(`❌ Unhandled error: ${error.message}`));
  process.exit(1);
});