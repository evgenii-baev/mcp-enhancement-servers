/**
 * Simple logger utility for application logging
 */

// Log levels
export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

// Logger configuration
interface LoggerConfig {
  level: LogLevel;
  enableConsole: boolean;
  prefix: string;
}

/**
 * Logger class for handling application logging
 */
class Logger {
  private config: LoggerConfig = {
    level: LogLevel.INFO,
    enableConsole: true,
    prefix: '[MCP]',
  };

  /**
   * Configure the logger
   */
  configure(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Log an error message
   */
  error(message: string, ...args: any[]): void {
    if (this.config.level >= LogLevel.ERROR) {
      this.log('ERROR', message, args);
    }
  }

  /**
   * Log a warning message
   */
  warn(message: string, ...args: any[]): void {
    if (this.config.level >= LogLevel.WARN) {
      this.log('WARN', message, args);
    }
  }

  /**
   * Log an info message
   */
  info(message: string, ...args: any[]): void {
    if (this.config.level >= LogLevel.INFO) {
      this.log('INFO', message, args);
    }
  }

  /**
   * Log a debug message
   */
  debug(message: string, ...args: any[]): void {
    if (this.config.level >= LogLevel.DEBUG) {
      this.log('DEBUG', message, args);
    }
  }

  /**
   * Internal log implementation
   */
  private log(level: string, message: string, args: any[]): void {
    if (!this.config.enableConsole) {
      return;
    }

    const timestamp = new Date().toISOString();
    const formattedMessage = `${timestamp} ${this.config.prefix} [${level}] ${message}`;
    
    switch(level) {
      case 'ERROR':
        console.error(formattedMessage, ...args);
        break;
      case 'WARN':
        console.warn(formattedMessage, ...args);
        break;
      case 'INFO':
        console.info(formattedMessage, ...args);
        break;
      case 'DEBUG':
        console.debug(formattedMessage, ...args);
        break;
      default:
        console.log(formattedMessage, ...args);
    }
  }
}

// Export a singleton instance
export const logger = new Logger(); 