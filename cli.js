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

const version = '0.1.1';

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true,
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly)
      symbols = symbols.filter(function(sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function(key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(
        target,
        Object.getOwnPropertyDescriptors(source),
      );
    } else {
      ownKeys(Object(source)).forEach(function(key) {
        Object.defineProperty(
          target,
          key,
          Object.getOwnPropertyDescriptor(source, key),
        );
      });
    }
  }

  return target;
}

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

const readConfigFrom = (filename, relative = null) => {
  const cwd = relative ? relative : process.cwd();
  const configFilePath = path.join(cwd, filename);
  const isPresent = fs.existsSync(configFilePath);
  if (!isPresent) return {};
  const configFile = fs.readFileSync(configFilePath);
  const config = JSON.parse(configFile);
  logger('debug')('Reading config from', configFilePath);
  config.scripts = mapExecutables(config.scripts);
  return config;
};

const readConfig = () => {
  const userConfig = readConfigFrom('.devrc', process.env.HOME);
  const devrcConfig = readConfigFrom('.devrc');
  const pkgConfig = readConfigFrom('package.json');

  const config = _objectSpread2(
    {},
    userConfig,
    {},
    pkgConfig,
    {},
    devrcConfig,
    {
      scripts: _objectSpread2(
        {},
        userConfig.scripts,
        {},
        pkgConfig.scripts,
        {},
        devrcConfig.scripts,
      ),
    },
  );

  logger('debug')('Scripts: ', config.scripts);
  return config;
};

const execScript = (cmd, scripts) => {
  exitIf(
    !scripts[cmd],
    `Cannot find script '${cmd}', check your .devrc or package.json file and try again.`,
  );
  return scripts[cmd]();
};

program
  .version(version, '-v, --version')
  .usage('[options] <cmd>')
  .option('-c, --config', 'Path to .devrc file');
program.action((cmd) => {
  const config = readConfig();
  execScript(cmd, config.scripts);
});
program.parse(process.argv);
