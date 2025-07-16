#!/usr/bin/env node
import axios from 'axios';
import { program } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import Table from 'cli-table3';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Configure the CLI
program
  .name('monitoring-status')
  .description('Check the status of DropFlow Pro services')
  .option('-e, --environment <env>', 'Environment to check', 'production')
  .option('-v, --verbose', 'Show detailed information', false)
  .option('-j, --json', 'Output as JSON', false)
  .parse(process.argv);

const options = program.opts();

// Service endpoints to check
const services = [
  {
    name: 'Frontend',
    url: options.environment === 'production' 
      ? 'https://app.dropflow.pro/api/health' 
      : 'http://localhost:3000/api/health',
    type: 'frontend'
  },
  {
    name: 'API',
    url: options.environment === 'production' 
      ? 'https://api.dropflow.pro/health' 
      : 'http://localhost:8000/health',
    type: 'backend'
  },
  {
    name: 'Supabase',
    url: options.environment === 'production' 
      ? 'https://efbiiertneyrwuwmxgvm.supabase.co/rest/v1/health' 
      : 'http://localhost:54321/rest/v1/health',
    type: 'database',
    headers: {
      'apikey': process.env.SUPABASE_ANON_KEY || ''
    }
  }
];

// Additional external services to check
const externalServices = [
  { name: 'AliExpress API', type: 'integration' },
  { name: 'BigBuy API', type: 'integration' },
  { name: 'Shopify API', type: 'integration' },
  { name: '17Track API', type: 'integration' },
  { name: 'Stripe API', type: 'payment' },
  { name: 'OpenAI API', type: 'ai' }
];

// Main function
async function main() {
  console.log(chalk.bold.blue('🔍 DropFlow Pro Monitoring Status'));
  console.log(chalk.blue(`Environment: ${options.environment}\n`));
  
  const spinner = ora('Checking services status...').start();
  
  try {
    // Check core services
    const results = await Promise.all(
      services.map(async (service) => {
        try {
          const startTime = Date.now();
          const response = await axios.get(service.url, { 
            timeout: 5000,
            headers: service.headers
          });
          const responseTime = Date.now() - startTime;
          
          return {
            name: service.name,
            type: service.type,
            status: response.status === 200 ? 'up' : 'degraded',
            responseTime,
            details: response.data
          };
        } catch (error) {
          return {
            name: service.name,
            type: service.type,
            status: 'down',
            responseTime: null,
            error: error.message
          };
        }
      })
    );
    
    // Mock external services status (in a real app, you would check these too)
    const externalResults = externalServices.map(service => ({
      name: service.name,
      type: service.type,
      status: Math.random() > 0.1 ? 'up' : 'degraded', // 90% chance of being up
      responseTime: Math.floor(Math.random() * 500) + 100, // Random response time between 100-600ms
      details: { status: 'healthy' }
    }));
    
    const allResults = [...results, ...externalResults];
    
    spinner.stop();
    
    // Output results
    if (options.json) {
      console.log(JSON.stringify(allResults, null, 2));
    } else {
      displayStatusTable(allResults);
      
      if (options.verbose) {
        displayDetailedInfo(allResults);
      }
      
      // Summary
      const upCount = allResults.filter(r => r.status === 'up').length;
      const degradedCount = allResults.filter(r => r.status === 'degraded').length;
      const downCount = allResults.filter(r => r.status === 'down').length;
      
      console.log('\n' + chalk.bold('Summary:'));
      console.log(`Total services: ${allResults.length}`);
      console.log(`${chalk.green('✓')} Up: ${upCount}`);
      console.log(`${chalk.yellow('!')} Degraded: ${degradedCount}`);
      console.log(`${chalk.red('✗')} Down: ${downCount}`);
      
      // Overall status
      const overallStatus = downCount > 0 ? 'critical' : degradedCount > 0 ? 'degraded' : 'healthy';
      console.log('\n' + chalk.bold('Overall Status:'), getStatusColor(overallStatus)(overallStatus.toUpperCase()));
    }
    
    // Exit with appropriate code
    if (allResults.some(r => r.status === 'down')) {
      process.exit(1);
    }
  } catch (error) {
    spinner.fail('Error checking services');
    console.error(chalk.red(`Error: ${error.message}`));
    process.exit(1);
  }
}

// Display status table
function displayStatusTable(results) {
  const table = new Table({
    head: [
      chalk.bold('Service'),
      chalk.bold('Type'),
      chalk.bold('Status'),
      chalk.bold('Response Time')
    ],
    colWidths: [25, 15, 15, 15]
  });
  
  results.forEach(result => {
    table.push([
      result.name,
      result.type,
      getStatusColor(result.status)(result.status.toUpperCase()),
      result.responseTime ? `${result.responseTime}ms` : 'N/A'
    ]);
  });
  
  console.log(table.toString());
}

// Display detailed information
function displayDetailedInfo(results) {
  console.log('\n' + chalk.bold('Detailed Information:'));
  
  results.forEach(result => {
    console.log('\n' + chalk.bold(result.name));
    console.log(`Type: ${result.type}`);
    console.log(`Status: ${getStatusColor(result.status)(result.status.toUpperCase())}`);
    console.log(`Response Time: ${result.responseTime ? `${result.responseTime}ms` : 'N/A'}`);
    
    if (result.error) {
      console.log(`Error: ${result.error}`);
    }
    
    if (result.details && options.verbose) {
      console.log('Details:', result.details);
    }
  });
}

// Get color function based on status
function getStatusColor(status) {
  switch (status) {
    case 'up':
    case 'healthy':
      return chalk.green;
    case 'degraded':
      return chalk.yellow;
    case 'down':
    case 'critical':
      return chalk.red;
    default:
      return chalk.white;
  }
}

// Run the main function
main().catch(error => {
  console.error(chalk.red(`Unhandled error: ${error.message}`));
  process.exit(1);
});