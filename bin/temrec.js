#! /usr/bin/env node

let { program } = require('commander')

program
  .name('temrec')
  .argument('<ids...>', 'List of record ids to be recorded')
  .option('-o, --output <path>', 'output folder', '')
  .option('-p, --padding <time>', 'padding in ms', '200')
  .parse()

require('../src')(program.args, program.opts())
