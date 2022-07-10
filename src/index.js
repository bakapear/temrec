let fs = require('fs')
let ph = require('path')
let util = require('./util')
let DemRec = require('demrec')
let Logger = require('./logger')
let tempus = require('./tempus')
let extract = require('./extract')
let dlr = require('../lib/downloader')

let DEFAULTS = { padding: 200, output: 'output', pre: 0, timed: false }
let TMP = ph.resolve(__dirname, 'tmp')

class TemRec extends DemRec {
  constructor (config, logger) {
    super(config)
    if (logger) {
      logger = new Logger(TemRec.Events)
      this.on('log', logger.onlog)
    }
  }
}

TemRec.Events.add(['MAP_DOWNLOAD', 'MAP_DOWNLOAD_END', 'MAP_EXTRACT', 'MAP_EXTRACT_END', 'DEMO_DOWNLOAD', 'DEMO_DOWNLOAD_END', 'DEMO_EXTRACT', 'DEMO_EXTRACT_END'])

TemRec.fetch = id => tempus.getRecord(id, true)

TemRec.prototype.map = async function (map) {
  for (let path of ['maps', 'download/maps']) {
    let maps = fs.readdirSync(ph.join(this.game.dir, path))
    let m = maps.find(x => x === map + '.bsp')
    if (m) return ph.join(this.game.dir, path, m)
  }
  this.emit('log', { event: TemRec.Events.MAP_DOWNLOAD, map })
  let url = tempus.mapURL(map)
  let file = await dlr(url, TMP, progress => {
    this.emit('log', { event: TemRec.Events.MAP_DOWNLOAD, map, progress })
  })
  this.emit('log', { event: TemRec.Events.MAP_DOWNLOAD_END, map })

  this.emit('log', { event: TemRec.Events.MAP_EXTRACT, map })
  let dest = ph.join(this.game.dir, 'download/maps', map + '.bsp')
  await extract.bz2(file, dest, progress => {
    this.emit('log', { event: TemRec.Events.MAP_EXTRACT, map, progress })
  })
  util.remove(file)
  this.emit('log', { event: TemRec.Events.MAP_EXTRACT_END, map })

  return dest
}

TemRec.prototype.demo = async function (demo) {
  let name = ph.basename(demo, '.zip')
  this.emit('log', { event: TemRec.Events.DEMO_DOWNLOAD, demo: name })
  let file = await dlr(demo, TMP, progress => {
    this.emit('log', { event: TemRec.Events.DEMO_DOWNLOAD, demo: name, progress })
  })
  this.emit('log', { event: TemRec.Events.DEMO_DOWNLOAD_END, demo: name })

  this.emit('log', { event: TemRec.Events.DEMO_EXTRACT, demo: name })
  let dest = await extract.zip(file, TMP)
  util.remove(file)
  this.emit('log', { event: TemRec.Events.DEMO_EXTRACT_END, demo: name })

  return dest
}

TemRec.prototype.record = async function (ids, cfg) {
  let mult = true
  if (!Array.isArray(ids)) {
    mult = false
    ids = [ids]
  }

  cfg = cfg ? Object.assign(DEFAULTS, cfg) : DEFAULTS

  cfg.padding = Number(cfg.padding)
  if (isNaN(cfg.padding)) cfg.padding = 0

  cfg.pre = Number(cfg.pre)
  if (isNaN(cfg.pre)) cfg.pre = 0

  cfg.output = ph.resolve(cfg.output)

  let records = []
  for (let id of ids) {
    let rec = null
    if (typeof id === 'object') rec = id.id ? id : tempus.formatRecord(id)
    else rec = await tempus.getRecord(id, true)
    records.push(rec)
  }

  let files = []

  if (!fs.existsSync(TMP)) fs.mkdirSync(TMP)

  for (let rec of records) {
    await this.map(rec.map)

    let demo = await this.demo(rec.demo)

    let results = await DemRec.prototype.record.call(this, demo, {
      pre: cfg.pre,
      padding: cfg.padding,
      ticks: [rec.start, (cfg.timed ? (rec.start + (rec.time * (200 / 3))) : rec.end)],
      spec: rec.player,
      out: rec.id + '.mp4'
    }, cfg.output)

    util.remove(demo)

    files.push(results[0])
  }

  util.remove(TMP)

  return mult ? files : files[0]
}

module.exports = TemRec
