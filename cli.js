#!/usr/bin/env node
'use strict';

function _interopDefault(ex) {
  return ex && typeof ex === 'object' && 'default' in ex
    ? ex['default']
    : ex;
}

var program = _interopDefault(require('commander'));
var path = _interopDefault(require('path'));
var fs = _interopDefault(require('fs'));
var colors = _interopDefault(require('colors'));

const version = '1.0.0';

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

program
  .version(version, '-v, --version')
  .usage('[options] <cmd>')
  .option('-c, --config', 'Path to .devrc file');
program.action((cmd) => {
  const cwd = process.cwd();
  const configFile = path.join(cwd, '.devrc');

  if (fs.existsSync(configFile)) {
    const { scripts: scripts$$1 } = JSON.parse(
      fs.readFileSync(configFile),
    );
    logger('debug')(`Reading config from ${configFile}`);
    logger('debug')('scripts', scripts$$1);
  }
});
program.parse(process.argv);
