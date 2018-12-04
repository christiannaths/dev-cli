import program from 'commander';
import * as application from '../package.json';
import path from 'path';
import fs from 'fs';
import { logger } from './utils';

program
  .version(application.version, '-v, --version')
  .usage('[options] <cmd>')
  .option('-c, --config', 'Path to .devrc file');

program.action((cmd) => {
  const cwd = process.cwd();
  const configFile = path.join(cwd, '.devrc');

  if (fs.existsSync(configFile)) {
    const { scripts } = JSON.parse(fs.readFileSync(configFile));
    logger('debug')(`Reading config from ${configFile}`);
    logger('debug')('scripts', scripts);
  }
});

program.parse(process.argv);
