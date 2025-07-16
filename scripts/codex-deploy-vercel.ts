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
  .name('codex-deploy-vercel')
  .description('Deploy DropFlow Pro to Vercel')
  .option('-e, --environment <env>', 'Environment to deploy to', 'preview')
  .option('-t, --team <team>', 'Vercel team')
  .option('-p, --project <project>', 'Vercel project name')
  .option('--skip-build', 'Skip build step', false)
  .option('--skip-tests', 'Skip tests', false)
  .parse(process.argv);

const options = program.opts();

// Environment variables
const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const VERCEL_ORG_ID = process.env.VERCEL_ORG_ID;
const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID;

// Main function
async function main() {
  console.log('🚀 DropFlow Pro Vercel Deployment Tool');
  console.log('------------------------------------');
  
  // Check for Vercel CLI
  try {
    execSync('vercel --version', { stdio: 'ignore' });
  } catch (error) {
    console.error('❌ Vercel CLI is not installed. Please install it with: npm i -g vercel');
    process.exit(1);
  }
  
  // Check for required environment variables
  if (!VERCEL_TOKEN && options.environment === 'production') {
    console.error('❌ VERCEL_TOKEN environment variable is required for production deployments');
    process.exit(1);
  }
  
  // Run tests if not skipped
  if (!options.skipTests) {
    console.log('🧪 Running tests...');
    try {
      execSync('npm run test', { stdio: 'inherit' });
    } catch (error) {
      console.error('❌ Tests failed. Fix the issues before deploying.');
      process.exit(1);
    }
  } else {
    console.log('⏩ Skipping tests...');
  }
  
  // Build the project if not skipped
  if (!options.skipBuild) {
    console.log('🔨 Building project...');
    try {
      execSync('npm run build', { stdio: 'inherit' });
    } catch (error) {
      console.error('❌ Build failed. Fix the issues before deploying.');
      process.exit(1);
    }
  } else {
    console.log('⏩ Skipping build step...');
  }
  
  // Deploy to Vercel
  console.log(`🚀 Deploying to Vercel (${options.environment})...`);
  
  try {
    // Build the deployment command
    let deployCommand = 'vercel';
    
    // Add environment flag
    if (options.environment === 'production') {
      deployCommand += ' --prod';
    }
    
    // Add team if specified
    if (options.team) {
      deployCommand += ` --scope ${options.team}`;
    }
    
    // Add project if specified
    if (options.project) {
      deployCommand += ` --name ${options.project}`;
    }
    
    // Add token if available
    if (VERCEL_TOKEN) {
      deployCommand += ` --token ${VERCEL_TOKEN}`;
    }
    
    // Add org and project IDs if available
    if (VERCEL_ORG_ID) {
      deployCommand += ` --scope ${VERCEL_ORG_ID}`;
    }
    
    if (VERCEL_PROJECT_ID) {
      deployCommand += ` --project ${VERCEL_PROJECT_ID}`;
    }
    
    // Add yes flag to skip confirmation
    deployCommand += ' --yes';
    
    // Execute deployment
    console.log(`Executing: ${deployCommand}`);
    const output = execSync(deployCommand, { encoding: 'utf8' });
    
    // Parse deployment URL
    const deploymentUrl = output.match(/https:\/\/[^\s]+/)?.[0];
    
    console.log('\n✅ Deployment successful!');
    
    if (deploymentUrl) {
      console.log(`🌐 Deployment URL: ${deploymentUrl}`);
    }
    
    // Save deployment info
    const deploymentInfo = {
      environment: options.environment,
      timestamp: new Date().toISOString(),
      url: deploymentUrl,
      commit: execSync('git rev-parse HEAD').toString().trim(),
      branch: execSync('git rev-parse --abbrev-ref HEAD').toString().trim()
    };
    
    const deploymentsFile = path.join(process.cwd(), '.vercel-deployments.json');
    let deployments = [];
    
    if (fs.existsSync(deploymentsFile)) {
      deployments = JSON.parse(fs.readFileSync(deploymentsFile, 'utf8'));
    }
    
    deployments.push(deploymentInfo);
    fs.writeFileSync(deploymentsFile, JSON.stringify(deployments, null, 2));
    
    console.log('📝 Deployment info saved to .vercel-deployments.json');
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    process.exit(1);
  }
}

// Run the main function
main().catch(error => {
  console.error('❌ Unhandled error:', error);
  process.exit(1);
});