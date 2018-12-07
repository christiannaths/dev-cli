import { exitIf } from './utils';

const execScript = (cmd, scripts) => {
  exitIf(
    !scripts[cmd],
    `Cannot find script '${cmd}', check your .devrc or package.json file and try again.`,
  );
  return scripts[cmd]();
};

export default execScript;
