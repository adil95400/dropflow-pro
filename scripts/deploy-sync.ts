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
  .name('deploy-sync')
  .description('Build and deploy DropFlow Pro to various platforms')
  .option('-v, --vercel', 'Deploy to Vercel')
  .option('-n, --netlify', 'Deploy to Netlify')
  .option('-p, --production', 'Deploy to production environment', false)
  .option('-t, --team <team>', 'Team name for deployment')
  .option('-m, --message <message>', 'Deployment message', 'Automated deployment')
  .option('--skip-build', 'Skip build step', false)
  .parse(process.argv);

const options = program.opts();

// Main function
async function main() {
  console.log('🚀 DropFlow Pro Deployment Tool');
  console.log('-----------------------------');
  
  // Validate options
  if (!options.vercel && !options.netlify) {
    console.error('❌ Please specify a deployment platform (--vercel or --netlify)');
    process.exit(1);
  }
  
  try {
    // Run tests
    console.log('🧪 Running tests...');
    execSync('npm run test', { stdio: 'inherit' });
    
    // Build the project
    if (!options.skipBuild) {
      console.log('🔨 Building project...');
      execSync('npm run build', { stdio: 'inherit' });
    } else {
      console.log('⏩ Skipping build step...');
    }
    
    // Deploy
    if (options.vercel) {
      deployToVercel();
    } else if (options.netlify) {
      deployToNetlify();
    }
    
    console.log('✅ Deployment completed successfully!');
  } catch (error) {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  }
}

// Deploy to Vercel
function deployToVercel() {
  console.log('🚀 Deploying to Vercel...');
  
  try {
    // Check if Vercel CLI is installed
    try {
      execSync('vercel --version', { stdio: 'ignore' });
    } catch (error) {
      console.error('❌ Vercel CLI is not installed. Please install it with: npm i -g vercel');
      process.exit(1);
    }
    
    // Build command
    let command = 'vercel';
    
    if (options.production) {
      command += ' --prod';
    }
    
    if (options.team) {
      command += ` --scope ${options.team}`;
    }
    
    // Deploy
    console.log(`Executing: ${command}`);
    execSync(command, { stdio: 'inherit' });
    
    console.log('✅ Vercel deployment successful!');
  } catch (error) {
    console.error('❌ Vercel deployment failed:', error);
    process.exit(1);
  }
}

// Deploy to Netlify
function deployToNetlify() {
  console.log('🚀 Deploying to Netlify...');
  
  try {
    // Check if Netlify CLI is installed
    try {
      execSync('netlify --version', { stdio: 'ignore' });
    } catch (error) {
      console.error('❌ Netlify CLI is not installed. Please install it with: npm i -g netlify-cli');
      process.exit(1);
    }
    
    // Build command
    let command = 'netlify deploy';
    
    if (options.production) {
      command += ' --prod';
    } else {
      command += ' --draft';
    }
    
    command += ` --message "${options.message}"`;
    
    // Deploy
    console.log(`Executing: ${command}`);
    execSync(command, { stdio: 'inherit' });
    
    console.log('✅ Netlify deployment successful!');
  } catch (error) {
    console.error('❌ Netlify deployment failed:', error);
    process.exit(1);
  }
}

// Run the main function
main().catch(error => {
  console.error('❌ Unhandled error:', error);
  process.exit(1);
});