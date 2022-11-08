#! /usr/bin/env node
let CWD = process.cwd()
process.chdir(require('path').dirname(__dirname))

let ph = require('path')
let { program } = require('commander')

program
  .name('temrec')
  .argument('<ids...>', 'List of record ids to be recorded')
  .option('-o, --output <path>', 'output folder', '')
  .option('-p, --padding <time>', 'padding in ms', '200')
  .option('-r, --pre <time>', 'pre in ms', '0')
  .option('-t, --timed', 'use run duration instead of end tick', false)
  .option('-c, --cmd <command>', 'custom command to execute before recording', '')
  .option('-b, --cubemaps', 'build cubemaps when downloading map', false)
  .parse()

let TemRec = require('../')
let tr = new TemRec('config.ini', true) // enable logger

async function main (ids, cfg) {
  cfg.output = ph.resolve(CWD, cfg.output)

  let records = await Promise.all(ids.map(id => TemRec.fetch(id)))

  await tr.launch()

  for (let rec of records) {
    console.log(rec.id + ' << ' + rec.display)

    let out = await tr.record(rec, cfg)

    console.log(rec.id + ' >> ' + out)
  }

  await tr.exit()
}

main(program.args, program.opts())
