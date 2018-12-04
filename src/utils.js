import colors from 'colors';

const debugLogger = (...args) => {
  if (!process.env.DEBUG) return null;
  return console.log(...args);
};

const warnLogger = (...args) => {
  args = args.map((arg) => colors.yellow(arg));
  return console.warn(...args);
};

const errorLogger = (...args) => {
  args = args.map((arg) => colors.red(arg));
  return console.error(...args);
};

const logger = (...args) => {
  const specialLogger = {
    debug: debugLogger,
    warn: warnLogger,
    error: errorLogger,
  }[args[0]];

  if (specialLogger === undefined) return console.log(...args);
  return specialLogger;
};

const exitIf = (condition, message) => {
  if (!condition) return;

  logger('error')(message);
  process.exit(1);
};

export { logger, exitIf };
