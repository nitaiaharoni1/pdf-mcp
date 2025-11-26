/**
 * CLI Command Manager
 * Manages CLI command execution for PDF-MCP
 */

import * as os from 'os';
import * as path from 'path';
import { getPDFManager } from '../pdf/pdf-manager';

/**
 * Command Manager
 * Executes specific CLI commands
 */
export class CommandManager {
  /**
   * Execute version command
   */
  static executeVersion(): void {
    const packageJson = require('../../package.json');
    console.log(`${packageJson.name} v${packageJson.version}`);
    process.exit(0);
  }

  /**
   * Execute help command
   */
  static executeHelp(): void {
    console.log(`
PDF MCP Server - Model Context Protocol server for PDF operations

Usage:
  pdf-mcp [command] [options]

Commands:
  init [directory]    Initialize PDF working directory (default: ~/pdf-mcp)
  status              Show current configuration and status
  test [pdf_path]     Test PDF operations with a sample PDF

Options:
  --help, -h          Show this help message
  --version, -v       Show version information

Examples:
  pdf-mcp init ~/my-pdfs
  pdf-mcp status
  pdf-mcp test /path/to/sample.pdf

For more information, visit: https://github.com/nitaiaharoni1/pdf-mcp
`);
    process.exit(0);
  }

  /**
   * Execute init command - setup PDF working directory
   */
  static executeInit(args: string[]): void {
    const defaultDir = path.join(os.homedir(), 'pdf-mcp');
    const workingDir = args[0] || defaultDir;

    console.log(`\n📁 Initializing PDF-MCP working directory...`);
    console.log(`   Directory: ${workingDir}\n`);

    // Create directory if it doesn't exist
    const fs = require('fs');
    try {
      fs.mkdirSync(workingDir, { recursive: true });
      console.log(`✅ Created directory: ${workingDir}`);
    } catch (error: any) {
      if (error.code !== 'EEXIST') {
        console.error(`❌ Failed to create directory: ${error.message}`);
        process.exit(1);
      }
      console.log(`✅ Directory already exists: ${workingDir}`);
    }

    // Create .env.example if it doesn't exist
    const envExamplePath = path.join(workingDir, '.env.example');
    if (!fs.existsSync(envExamplePath)) {
      const envExample = `# PDF-MCP Configuration
# Working directory for PDF operations
PDF_WORKING_DIR=${workingDir}

# Optional: Temporary directory for PDF operations
# TEMP_DIR=/tmp/pdf-mcp
`;
      fs.writeFileSync(envExamplePath, envExample);
      console.log(`✅ Created .env.example`);
    }

    console.log(`\n✨ PDF-MCP initialized successfully!`);
    console.log(`\nNext steps:`);
    console.log(`  1. Configure Claude Desktop to use pdf-mcp`);
    console.log(`  2. Use PDF operations through Claude Desktop`);
    console.log(`  3. Run 'pdf-mcp status' to check configuration\n`);
    process.exit(0);
  }

  /**
   * Execute status command - show current configuration
   */
  static executeStatus(): void {
    console.log(`\n📊 PDF-MCP Status\n`);

    // Show version
    const packageJson = require('../../package.json');
    console.log(`Version: ${packageJson.version}`);

    // Show active sessions
    const manager = getPDFManager();
    const sessions = manager.getActiveSessions();
    console.log(`Active PDF sessions: ${sessions.length}`);

    if (sessions.length > 0) {
      console.log(`  Sessions: ${sessions.join(', ')}`);
    }

    // Show working directory
    const defaultDir = path.join(os.homedir(), 'pdf-mcp');
    console.log(`Default working directory: ${defaultDir}`);

    // Check if directory exists
    const fs = require('fs');
    if (fs.existsSync(defaultDir)) {
      console.log(`✅ Working directory exists`);
    } else {
      console.log(`⚠️  Working directory does not exist (run 'pdf-mcp init')`);
    }

    console.log(`\n✨ PDF-MCP is ready to use!\n`);
    process.exit(0);
  }

  /**
   * Execute test command - test PDF operations
   */
  static executeTest(args: string[]): void {
    console.log(`\n🧪 Testing PDF operations...\n`);

    const pdfPath = args[0];

    if (!pdfPath) {
      console.error(`❌ Please provide a PDF file path`);
      console.error(`   Usage: pdf-mcp test /path/to/file.pdf\n`);
      process.exit(1);
    }

    const manager = getPDFManager();

    // Test creating a PDF
    console.log(`1. Testing PDF creation...`);
    const testPromise = manager
      .createSession()
      .then((sessionId) => {
        console.log(`   ✅ Created PDF session: ${sessionId}`);

        // Test loading PDF if path provided
        if (pdfPath) {
          console.log(`\n2. Testing PDF loading...`);
          return manager
            .loadFromFile(pdfPath)
            .then((loadSessionId) => {
              console.log(`   ✅ Loaded PDF: ${loadSessionId}`);
              return manager.getInfo(loadSessionId);
            })
            .then((info) => {
              console.log(`   ✅ PDF Info:`);
              console.log(`      Pages: ${info.pageCount}`);
              console.log(`      Size: ${(info.fileSize / 1024).toFixed(2)} KB`);
              console.log(`      Has Forms: ${info.hasForms || false}`);
            });
        }
        return Promise.resolve();
      })
      .then(() => {
        console.log(`\n✨ All tests passed!\n`);
        process.exit(0);
      })
      .catch((error: any) => {
        console.error(`\n❌ Test failed: ${error.message}\n`);
        process.exit(1);
      });
    
    // Return promise to satisfy TypeScript
    return testPromise as any;
  }
}
