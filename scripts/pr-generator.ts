#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { program } from 'commander';
import { Configuration, OpenAIApi } from 'openai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Configure the CLI
program
  .name('pr-generator')
  .description('Generate PR descriptions using AI')
  .option('-b, --base <branch>', 'Base branch for comparison', 'main')
  .option('-t, --title <title>', 'Custom PR title')
  .option('-d, --draft', 'Mark PR as draft', false)
  .option('--dry-run', 'Generate description without creating PR', false)
  .parse(process.argv);

const options = program.opts();

// Check for OpenAI API key
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  console.error('❌ OpenAI API key not found. Please set OPENAI_API_KEY environment variable.');
  process.exit(1);
}

// Initialize OpenAI
const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Main function
async function main() {
  try {
    console.log('🤖 DropFlow Pro PR Generator');
    console.log('---------------------------');
    
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
    
    if (currentBranch === options.base) {
      console.error(`❌ Current branch is the same as base branch (${options.base})`);
      process.exit(1);
    }
    
    // Get diff
    console.log(`🔍 Analyzing changes between ${options.base} and ${currentBranch}...`);
    const diff = execSync(`git diff ${options.base}...${currentBranch} --stat`).toString();
    
    if (!diff) {
      console.error('❌ No changes detected');
      process.exit(1);
    }
    
    // Get commit messages
    const commits = execSync(`git log ${options.base}..${currentBranch} --pretty=format:"%s"`).toString();
    
    // Generate PR description using AI
    console.log('🧠 Generating PR description with AI...');
    const prDescription = await generatePRDescription(diff, commits);
    
    // Generate PR title if not provided
    let prTitle = options.title;
    if (!prTitle) {
      prTitle = await generatePRTitle(diff, commits);
    }
    
    console.log('\n📝 Generated PR Title:');
    console.log(prTitle);
    
    console.log('\n📝 Generated PR Description:');
    console.log(prDescription);
    
    if (options.dryRun) {
      console.log('\n🏁 Dry run complete. PR was not created.');
      return;
    }
    
    // Confirm before creating PR
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    readline.question('\n❓ Create PR with this description? (y/n): ', (answer: string) => {
      readline.close();
      
      if (answer.toLowerCase() === 'y') {
        createPR(currentBranch, options.base, prTitle, prDescription, options.draft);
      } else {
        console.log('❌ PR creation cancelled');
      }
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Generate PR description using OpenAI
async function generatePRDescription(diff: string, commits: string): Promise<string> {
  const prompt = `
You are an AI assistant helping to generate a detailed pull request description for a software project.

Here are the changes between branches:
${diff}

And here are the commit messages:
${commits}

Based on this information, generate a comprehensive PR description with the following sections:
1. Summary - A brief overview of the changes
2. Changes - Detailed list of changes made
3. Testing - How to test these changes
4. Additional Notes - Any other relevant information

Format the description in Markdown.
`;

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1000,
    });

    return response.data.choices[0]?.message?.content || 'Failed to generate PR description';
  } catch (error) {
    console.error('Error generating PR description:', error);
    return 'Failed to generate PR description due to an error.';
  }
}

// Generate PR title using OpenAI
async function generatePRTitle(diff: string, commits: string): Promise<string> {
  const prompt = `
You are an AI assistant helping to generate a concise pull request title for a software project.

Here are the changes between branches:
${diff}

And here are the commit messages:
${commits}

Based on this information, generate a short, descriptive PR title (max 50-70 characters).
The title should start with a category like "feat:", "fix:", "docs:", "refactor:", etc. following conventional commits format.
`;

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 100,
    });

    return response.data.choices[0]?.message?.content || 'Generated PR Title';
  } catch (error) {
    console.error('Error generating PR title:', error);
    return 'Generated PR Title';
  }
}

// Create PR using GitHub CLI
function createPR(currentBranch: string, baseBranch: string, title: string, description: string, isDraft: boolean) {
  try {
    // Check if GitHub CLI is installed
    try {
      execSync('gh --version', { stdio: 'ignore' });
    } catch (error) {
      console.error('❌ GitHub CLI (gh) is not installed. Please install it to create PRs.');
      process.exit(1);
    }
    
    // Create temporary file for PR description
    const tempFile = path.join(process.cwd(), '.pr-description-temp.md');
    fs.writeFileSync(tempFile, description);
    
    // Build command
    let command = `gh pr create --base ${baseBranch} --head ${currentBranch} --title "${title}" --body-file ${tempFile}`;
    
    if (isDraft) {
      command += ' --draft';
    }
    
    // Create PR
    console.log('🚀 Creating PR...');
    execSync(command, { stdio: 'inherit' });
    
    // Clean up
    fs.unlinkSync(tempFile);
    
    console.log('✅ PR created successfully!');
  } catch (error) {
    console.error('❌ Error creating PR:', error);
    process.exit(1);
  }
}

// Run the main function
main().catch(error => {
  console.error('❌ Unhandled error:', error);
  process.exit(1);
});