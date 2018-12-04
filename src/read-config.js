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

export default readConfig;
