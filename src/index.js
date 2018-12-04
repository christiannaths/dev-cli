import program from 'commander';
import * as application from '../package.json';
import readConfig from './read-config';
import execScript from './exec-script';

program
  .version(application.version, '-v, --version')
  .usage('[options] <cmd>')
  .option('-c, --config', 'Path to .devrc file');

program.action((cmd) => {
  const config = readConfig();
  execScript(cmd, config.scripts);
});

program.parse(process.argv);
