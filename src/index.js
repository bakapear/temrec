let fs = require('fs')
let ph = require('path')
let util = require('./util')
let DemRec = require('demrec')
let Logger = require('./logger')
let tempus = require('./tempus')
let extract = require('./extract')
let dlr = require('../lib/downloader')

let TMP = ph.resolve(__dirname, '..', 'tmp')

class TemRec extends DemRec {
  constructor (config, logger) {
    super(config)
    if (logger) {
      this.logger = new Logger(TemRec.Events)
      this.on('log', this.logger.onlog)
    }
    this.tmp = TMP
  }
}

TemRec.API_URL = 'https://tempus2.xyz/api/v0'
TemRec.MAP_URL = 'https://static.tempus2.xyz/tempus/server/maps/%MAP%.bsp.bz2'

TemRec.Events.add(['MAP_DOWNLOAD', 'MAP_DOWNLOAD_END', 'MAP_EXTRACT', 'MAP_EXTRACT_END', 'DEMO_DOWNLOAD', 'DEMO_DOWNLOAD_END', 'DEMO_EXTRACT', 'DEMO_EXTRACT_END', 'CUBEMAPS_LAUNCH', 'CUBEMAPS_LAUNCH_END', 'CUBEMAPS_BUILD', 'CUBEMAPS_BUILD_END', 'CUBEMAPS_RESTART', 'CUBEMAPS_RESTART_END'])

TemRec.fetch = id => tempus.getRecord(TemRec.API_URL, id, true)

TemRec.prototype.map = async function (map) {
  for (let path of ['maps', 'download/maps']) {
    let dir = ph.join(this.game.dir, path)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    let maps = fs.readdirSync(dir)
    let m = maps.find(x => x === map + '.bsp')
    if (m) return { had: true, dest: ph.join(this.game.dir, path, m) }
  }
  this.emit('log', { event: TemRec.Events.MAP_DOWNLOAD, map })
  let url = tempus.mapURL(TemRec.MAP_URL, map)
  let file = await dlr(url, this.tmp, progress => {
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

  return { had: false, dest }
}

TemRec.prototype.buildcubemaps = async function (map) {
  this.emit('log', { event: TemRec.Events.CUBEMAPS_LAUNCH, map })
  await this.exit(true)

  let cmds = this.cfg.General.game_cmds
  let args = this.cfg.General.game_args
  this.cfg.General.game_cmds += `; mat_hdr_level 0; mat_specular 0; map "${map}"`
  this.cfg.General.game_args += ' -buildcubemaps -nosound'

  await this.launch(true)
  this.emit('log', { event: TemRec.Events.CUBEMAPS_LAUNCH_END, map })

  this.emit('log', { event: TemRec.Events.CUBEMAPS_BUILD, map })
  await new Promise(resolve => this.app.on('finish', resolve))
  this.emit('log', { event: TemRec.Events.CUBEMAPS_BUILD_END, map })

  this.cfg.General.game_cmds = cmds
  this.cfg.General.game_args = args

  this.emit('log', { event: TemRec.Events.CUBEMAPS_RESTART, map })
  await this.launch(true)
  this.emit('log', { event: TemRec.Events.CUBEMAPS_RESTART_END, map })
}

TemRec.prototype.demo = async function (demo) {
  let ext = demo.slice(demo.lastIndexOf('.'))
  let name = ph.basename(demo, ext)
  this.emit('log', { event: TemRec.Events.DEMO_DOWNLOAD, demo: name })
  let file = await dlr(demo, this.tmp, progress => {
    this.emit('log', { event: TemRec.Events.DEMO_DOWNLOAD, demo: name, progress })
  })
  this.emit('log', { event: TemRec.Events.DEMO_DOWNLOAD_END, demo: name })

  let dest = file

  if (ext === '.zip') {
    this.emit('log', { event: TemRec.Events.DEMO_EXTRACT, demo: name })
    dest = await extract.zip(file, this.tmp)
    util.remove(file)
  }

  this.emit('log', { event: TemRec.Events.DEMO_EXTRACT_END, demo: name })

  return dest
}

TemRec.prototype.record = async function (ids, cfg) {
  let mult = true
  if (!Array.isArray(ids)) {
    mult = false
    ids = [ids]
  }

  let DEFAULTS = { padding: 200, output: 'output', pre: 0, timed: false, cmd: '', vis: false, reload: false, ffmpeg: {} }

  cfg = cfg ? Object.assign(DEFAULTS, cfg) : DEFAULTS

  cfg.padding = Number(cfg.padding)
  if (isNaN(cfg.padding)) cfg.padding = 0

  cfg.pre = Number(cfg.pre)
  if (isNaN(cfg.pre)) cfg.pre = 0

  cfg.output = ph.resolve(cfg.output)

  let records = []
  for (let id of ids) records.push(await TemRec.fetch(id))

  let files = []

  if (!fs.existsSync(this.tmp)) fs.mkdirSync(this.tmp)

  for (let rec of records) {
    let m = await this.map(rec.map)
    if (cfg.cubemaps && !m.had) await this.buildcubemaps(rec.map)

    let demo = null

    if (!cfg.local) demo = await this.demo(rec.demo)
    else {
      let path = ph.resolve(cfg.local, rec.id + '.dem')
      if (!fs.existsSync(path)) throw Error(`Local demo file "${path}" does not exist!`)
      demo = path
    }

    let results = await DemRec.prototype.record.call(this, demo, {
      pre: cfg.pre,
      vis: cfg.vis,
      reload: cfg.reload,
      padding: cfg.padding,
      ticks: [rec.start, (cfg.timed ? (rec.start + (rec.time * (200 / 3))) : rec.end)],
      spec: rec.player,
      cmd: cfg.cmd,
      ffmpeg: cfg.ffmpeg,
      out: rec.id + '.mp4'
    }, cfg.output)

    util.remove(demo)

    files.push(results[0])
  }

  util.remove(this.tmp)

  return mult ? files : files[0]
}

TemRec.prototype.exit = async function (silent) {
  if (this.logger) this.logger.stop()
  await DemRec.prototype.exit.call(this, silent)
}

module.exports = TemRec
