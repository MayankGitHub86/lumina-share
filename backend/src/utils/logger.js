const config = require('../config');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

class Logger {
  constructor() {
    this.level = config.logLevel;
  }

  formatMessage(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const metaStr = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] [${level}] ${message}${metaStr}`;
  }

  info(message, meta) {
    console.log(`${colors.cyan}ℹ ${this.formatMessage('INFO', message, meta)}${colors.reset}`);
  }

  success(message, meta) {
    console.log(`${colors.green}✓ ${this.formatMessage('SUCCESS', message, meta)}${colors.reset}`);
  }

  warn(message, meta) {
    console.warn(`${colors.yellow}⚠ ${this.formatMessage('WARN', message, meta)}${colors.reset}`);
  }

  error(message, meta) {
    console.error(`${colors.red}✗ ${this.formatMessage('ERROR', message, meta)}${colors.reset}`);
  }

  debug(message, meta) {
    if (config.nodeEnv === 'development') {
      console.log(`${colors.magenta}⚙ ${this.formatMessage('DEBUG', message, meta)}${colors.reset}`);
    }
  }

  http(method, url, statusCode, duration) {
    const color = statusCode >= 500 ? colors.red : statusCode >= 400 ? colors.yellow : colors.green;
    console.log(`${color}${method} ${url} ${statusCode} - ${duration}ms${colors.reset}`);
  }
}

module.exports = new Logger();
