import { exitIf } from './utils';

const execScript = (cmd, scripts) => {
  exitIf(!scripts[cmd], 'Script does not exist');
  return scripts[cmd]();
};

export default execScript;
