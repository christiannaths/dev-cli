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
var childProcess = _interopDefault(require('child_process'));

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

const exitIf = (condition, message) => {
  if (!condition) return;
  logger('error')(message);
  process.exit(1);
};

const mapExecutables = (scripts) => {
  const { execSync } = childProcess;

  const executable = (script) => () => {
    execSync(script, {
      stdio: [0, 1, 2],
    });
  };

  Object.keys(scripts).forEach((key) => {
    const script = scripts[key];
    scripts[key] = executable(script);
  });
  return scripts;
};

const readConfig = () => {
  const cwd = process.cwd();
  const configFilePath = path.join(cwd, '.devrc');
  exitIf(
    !fs.existsSync(configFilePath),
    'Cannot find .devrc file, exiting.',
  );
  const configFile = fs.readFileSync(configFilePath);
  const config = JSON.parse(configFile);
  logger('debug')('Reading config from', configFilePath);
  logger('debug')('Config: ', config);
  config.scripts = mapExecutables(config.scripts);
  return config;
};

// import path from 'path';

const execScript = (cmd, scripts) => {
  exitIf(!scripts[cmd], 'Script does not exist');
  return scripts[cmd]();
};

program
  .version(version, '-v, --version')
  .usage('[options] <cmd>')
  .option('-c, --config', 'Path to .devrc file');
program.action((cmd) => {
  const config = readConfig();
  return execScript(cmd, config.scripts);
});
program.parse(process.argv);
