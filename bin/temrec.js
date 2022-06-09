#! /usr/bin/env node
let ph = require('path')
let { program } = require('commander')

program
  .name('temrec')
  .argument('<ids...>', 'List of record ids to be recorded')
  .option('-o, --output <path>', 'output folder', '')
  .option('-p, --padding <time>', 'padding in ms', '200')
  .parse()

let dir = ph.resolve(__dirname, '..')
let TemRec = require(ph.resolve(dir, 'src'))
let tr = new TemRec(ph.resolve(dir, 'config.ini'))

async function main (ids, cfg) {
  await tr.launch()
  await tr.record(ids, cfg)
  await tr.exit()
}

main(program.args, program.opts())
