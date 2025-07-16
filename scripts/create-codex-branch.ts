#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { program } from 'commander';
import { v4 as uuidv4 } from 'uuid';

// Configure the CLI
program
  .name('create-codex-branch')
  .description('Create a new branch for Codex development')
  .option('-n, --name <name>', 'Branch name (without prefix)', '')
  .option('-b, --base <branch>', 'Base branch', 'main')
  .option('-p, --prefix <prefix>', 'Branch prefix', 'codex/')
  .option('-d, --description <description>', 'Branch description')
  .parse(process.argv);

const options = program.opts();

// Main function
async function main() {
  console.log('🧠 DropFlow Pro Codex Branch Creator');
  
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
  
  // Generate branch name if not provided
  let branchName = options.name;
  if (!branchName) {
    // Generate a name based on current date and random ID
    const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const shortId = uuidv4().split('-')[0];
    branchName = `${date}-${shortId}`;
  }
  
  // Add prefix
  const fullBranchName = `${options.prefix}${branchName}`;
  
  // Get current branch
  const currentBranch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
  console.log(`📂 Current branch: ${currentBranch}`);
  
  // Make sure base branch is up to date
  if (currentBranch !== options.base) {
    console.log(`🔄 Switching to base branch: ${options.base}`);
    execSync(`git checkout ${options.base}`);
  }
  
  console.log(`⬇️ Pulling latest changes from ${options.base}`);
  execSync(`git pull origin ${options.base}`);
  
  // Create new branch
  console.log(`🌱 Creating new branch: ${fullBranchName}`);
  execSync(`git checkout -b ${fullBranchName}`);
  
  // Create branch description file
  if (options.description) {
    const descriptionDir = path.join(process.cwd(), '.git', 'branches');
    if (!fs.existsSync(descriptionDir)) {
      fs.mkdirSync(descriptionDir, { recursive: true });
    }
    
    const descriptionFile = path.join(descriptionDir, fullBranchName);
    fs.writeFileSync(descriptionFile, options.description);
    console.log('📝 Branch description saved');
  }
  
  // Create a README for the branch
  const readmeContent = `# Codex Branch: ${branchName}

Created: ${new Date().toISOString()}
Base: ${options.base}

## Description
${options.description || 'No description provided'}

## Purpose
This branch was created for Codex development.

## Tasks
- [ ] Task 1
- [ ] Task 2
- [ ] Task 3

## Notes
Add any additional notes here.
`;

  const readmeFile = path.join(process.cwd(), 'BRANCH-README.md');
  fs.writeFileSync(readmeFile, readmeContent);
  
  // Commit the README
  execSync('git add BRANCH-README.md');
  execSync(`git commit -m "chore: initialize codex branch ${branchName}"`);
  
  console.log(`\n✅ Branch ${fullBranchName} created successfully!`);
  console.log(`📋 Branch description: ${options.description || 'None'}`);
  console.log(`🔍 Current status:`);
  execSync('git status', { stdio: 'inherit' });
  
  console.log(`\n🚀 Next steps:`);
  console.log(`1. Make your changes`);
  console.log(`2. Commit and push your changes: git push -u origin ${fullBranchName}`);
  console.log(`3. Create a pull request to merge back to ${options.base}`);
}

// Run the main function
main().catch(error => {
  console.error('❌ Unhandled error:', error);
  process.exit(1);
});