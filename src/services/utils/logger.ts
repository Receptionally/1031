type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: unknown;
}

class Logger {
  private readonly logs: LogEntry[] = [];
  private readonly maxLogs = 1000;
  private readonly isDev: boolean;

  constructor(isDev = false) {
    this.isDev = isDev;
  }

  private log(level: LogLevel, message: string, data?: unknown) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data
    };

    // Add to in-memory logs
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Log to console with appropriate method and styling
    const consoleMethod = level === 'debug' ? 'log' : level;

    // Always log in Netlify functions, only log in browser when in dev mode
    if (typeof window === 'undefined' || this.isDev) {
      if (data) {
        console[consoleMethod](
          `[${entry.timestamp}] ${level.toUpperCase()}: ${message}`,
          data
        );
      } else {
        console[consoleMethod](
          `[${entry.timestamp}] ${level.toUpperCase()}: ${message}`
        );
      }
    }
  }

  debug(message: string, data?: unknown) {
    this.log('debug', message, data);
  }

  info(message: string, data?: unknown) {
    this.log('info', message, data);
  }

  warn(message: string, data?: unknown) {
    this.log('warn', message, data);
  }

  error(message: string, data?: unknown) {
    this.log('error', message, data);
  }

  getLogs(level?: LogLevel): LogEntry[] {
    return level 
      ? this.logs.filter(log => log.level === level)
      : [...this.logs];
  }

  clearLogs() {
    this.logs.length = 0;
  }
}

// Create logger instance with dev mode detection
export const logger = new Logger(import.meta?.env?.DEV ?? false);