/**
 * CLI Help Formatter
 * Formats help text for CLI commands
 */

export class HelpFormatter {
  /**
   * Format command help
   */
  static formatCommandHelp(command: string, description: string, usage: string): string {
    return `
${command}
  ${description}

Usage:
  ${usage}
`;
  }

  /**
   * Format options help
   */
  static formatOptionsHelp(options: Array<{ flag: string; description: string }>): string {
    return options.map((opt) => `  ${opt.flag.padEnd(20)} ${opt.description}`).join('\n');
  }
}
