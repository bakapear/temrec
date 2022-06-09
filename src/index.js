let fs = require('fs')
let ph = require('path')
let iy = require('inly')
let dp = require('despair')

let util = require('./util')
let DemRec = require('demrec')
let tempus = require('./tempus')

let TMP = ph.resolve(__dirname, 'tmp')

async function getRecords (ids) {
  let pack = []
  for (let id of ids) {
    let tem = await tempus.getRecord(id)
    if (tem.error) throw new Error(tem.error)
    pack.push({
      id: tem.id,
      url: tem.url,
      map: tem.zone.map,
      player: tem.player.id,
      ticks: { start: tem.time.start, end: tem.time.end },
      display: `${tem.id} >> ${tem.player.name} on ${tempus.formatZone(tem.zone)} - ${util.formatTime(tem.time.duration * 1000)}`
    })
  }
  return pack
}

function hasMap (dir, name) {
  for (let path of ['maps', 'download/maps']) {
    let maps = fs.readdirSync(ph.join(dir, path))
    if (maps.find(x => x === name + '.bsp')) return true
  }
  return false
}

async function downloadAndExtract (url, dest) {
  let buf = await dp(url, { encoding: 'binary' })
  let file = ph.join(TMP, buf.req.path.split('/').pop())
  fs.writeFileSync(file, buf.body, 'binary')
  let ex = iy(file, dest)
  return new Promise((resolve, reject) => {
    ex.on('file', name => {
      fs.unlinkSync(file)
      resolve(ph.join(dest, name))
    })
    ex.on('error', reject)
  })
}

function TemRec (config) {
  this.dr = new DemRec(config)

  this.dr.on('log', data => {
    if (data.type === 'Done') return
    let name = data.type === 'Merging' ? ('FFMPEG ' + (data.index || '')).trim() : 'Video'
    if (data.progress) {
      if (data.progress === 100) util.progress(`[${name}] Done!`, 2)
      else {
        if (data.type === 'Merging') util.progress(`[${name}] Processing... ${data.progress}%`, 1)
        else util.progress(`[Video] Rendering... ${data.progress}%`, 1)
      }
    } else {
      if (data.type === 'Merging') util.progress(`[${name}] Processing...`, 1)
      else util.progress(`[Video] ${data.type}...`, 1)
    }
  })
}

TemRec.prototype.launch = async function () {
  util.progress('[Game] Launching...', 1)
  await this.dr.launch()
  util.progress('[Game] Done!', 2)

  await new Promise(resolve => setTimeout(resolve, 3000))
}

TemRec.prototype.record = async function (ids, CFG = { padding: 300, output: 'output' }) {
  ids = await getRecords(ids)

  CFG.padding = Number(CFG.padding)
  if (isNaN(CFG.padding)) CFG.padding = 0

  CFG.out = ph.resolve(CFG.output)
  if (!fs.existsSync(CFG.out)) fs.mkdirSync(CFG.out)

  fs.rmSync(TMP, { recursive: true, force: true })
  if (!fs.existsSync(TMP)) fs.mkdirSync(TMP)

  for (let rec of ids) {
    let time = Date.now()

    console.log(rec.display)

    if (!hasMap(this.dr.game.dir, rec.map)) {
      util.progress('[Map] Downloading...', 1)
      await downloadAndExtract(tempus.mapURL(rec.map), ph.join(this.dr.game.dir, 'download', 'maps'))
      util.progress('[Map] Done!', 2)
    }

    util.progress('[Demo] Downloading...', 1)
    let demo = await downloadAndExtract(rec.url, TMP)
    util.progress('[Demo] Done!', 2)

    util.progress('[Video] Launching Demo...', 1)
    await this.dr.record(demo, {
      ticks: [rec.ticks.start - CFG.padding, rec.ticks.end + CFG.padding],
      cmd: `spec_mode 4; spec_player "${rec.player}"`,
      out: `${rec.id}.mp4`
    }, CFG.out)

    console.log(`[${util.time(time)}] >> ${ph.basename(CFG.out)}/${rec.id}.mp4`)
  }

  if (fs.existsSync(TMP)) fs.rmSync(TMP, { recursive: true, force: true })
}

TemRec.prototype.exit = async function () {
  await this.dr.exit()
  await new Promise(resolve => setTimeout(resolve, 3000))
}

module.exports = TemRec
