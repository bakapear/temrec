#! /usr/bin/env node
let ph = require("path")
let { program } = require('commander')

program
  .name('temrec')
  .argument('<ids...>', 'List of record ids to be recorded')
  .option('-o, --output <path>', 'output folder', '')
  .option('-p, --padding <time>', 'padding in ms', '200')
  .parse()

let dir = ph.resolve(__dirname, '..')
let temrec = require(ph.resolve(dir, 'src'))(ph.resolve(dir, 'config.ini'))
temrec(program.args, program.opts())
