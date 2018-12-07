import path from 'path';
import fs from 'fs';
import { logger, exitIf } from './utils';
import childProcess from 'child_process';

const mapExecutables = (scripts) => {
  const { execSync } = childProcess;
  const executable = (script) => () => {
    execSync(script, { stdio: [0, 1, 2] });
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

  const config = {
    ...userConfig,
    ...pkgConfig,
    ...devrcConfig,
    scripts: {
      ...userConfig.scripts,
      ...pkgConfig.scripts,
      ...devrcConfig.scripts,
    },
  };

  logger('debug')('Scripts: ', config.scripts);

  return config;
};

export default readConfig;
