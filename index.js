#!/usr/bin/env node
'use strict';

function _interopDefault(ex) {
  return ex && typeof ex === 'object' && 'default' in ex
    ? ex['default']
    : ex;
}

var program = _interopDefault(require('commander'));

const name = 'dev-cli';
const description = 'A command-line productivity tool for developers';
const version = '1.0.0';

program
  .version(version, '-v, --version')
  .usage('dev [options] <command ...>')
  .option('-p, --config', 'Add peppers')
  .option('-p, --peppers', 'Add peppers')
  .option('-P, --pineapple', 'Add pineapple')
  .option('-b, --bbq-sauce', 'Add bbq sauce')
  .option(
    '-c, --cheese [type]',
    'Add the specified type of cheese [marble]',
    'marble',
  )
  .parse(process.argv);
console.log(name);
console.log(description);
console.log('you ordered a pizza with:');
if (program.peppers) console.log('  - peppers');
if (program.pineapple) console.log('  - pineapple');
if (program.bbqSauce) console.log('  - bbq');
console.log('  - %s cheese', program.cheese);
