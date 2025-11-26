/**
 * Command-line interface for PDF-MCP
 */

// Type declaration for build-time injected constants
declare const __PACKAGE_VERSION__: string;

import { CommandManager } from './cli/command-manager';

/**
 * CLI Command Handler
 */
export function handleCliCommands(args: string[]): boolean {
  // Show version if requested
  if (args.length > 0 && (args[0] === '--version' || args[0] === '-v')) {
    const version =
      typeof __PACKAGE_VERSION__ !== 'undefined'
        ? __PACKAGE_VERSION__
        : '1.0.0';
    console.log(`pdf-mcp v${version}`);
    process.exit(0);
  }

  // Show help if requested
  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    CommandManager.executeHelp();
    return false;
  }

  // Handle commands
  const command = args[0];

  switch (command) {
    case 'init':
      CommandManager.executeInit(args.slice(1));
      return true;
    case 'status':
      CommandManager.executeStatus();
      return true;
    case 'test':
      CommandManager.executeTest(args.slice(1));
      return true;
    default:
      console.error(`Unknown command: ${command}`);
      console.error('Run "pdf-mcp --help" for usage information');
      process.exit(1);
  }

  return false;
}
