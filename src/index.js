let fs = require('fs')
let ph = require('path')
let iy = require('inly')
let dp = require('despair')
let util = require('./util')
let DemRec = require('demrec')
let tempus = require('./tempus')

let TMP = ph.resolve(__dirname, 'tmp')

let dr = new DemRec('config.ini')

let CFG = {
  padding: 200,
  out: ph.resolve('output')
}

async function main (ids) {
  if (!fs.existsSync(CFG.out)) fs.mkdirSync(CFG.out)
  fs.rmSync(TMP, { recursive: true, force: true })
  if (!fs.existsSync(TMP)) fs.mkdirSync(TMP)

  ids = await getRecords(ids)

  util.progress('[Game] Launching...', 1)
  await dr.launch()
  util.progress('[Game] Done!', 2)

  dr.on('log', data => {
    if (data.progress) {
      if (data.progress === 100) {
        util.progress('[Video] Done!', 2)
        util.progress('[FFMPEG] Merging videos...', 1)
      } else util.progress(`[Video] Rendering... ${data.progress}%`, 1)
    } else util.progress(`[Video] ${data.type}...`, 1)
  })

  for (let rec of ids) {
    let time = Date.now()

    console.log(rec.display)

    if (!hasMap(rec.map)) {
      util.progress('[Map] Downloading...', 1)
      await downloadAndExtract(tempus.mapURL(rec.map), ph.join(dr.game.dir, 'download', 'maps'))
      util.progress('[Map] Done!', 2)
    }

    util.progress('[Demo] Downloading...', 1)
    let demo = await downloadAndExtract(rec.url, TMP)
    util.progress('[Demo] Done!', 2)

    util.progress('[Video] Launching Demo...', 1)
    await dr.record({
      demo,
      tick: { ...rec.ticks, padding: CFG.padding },
      cmd: `spec_mode 4; spec_player "${rec.player}"`
    }, ph.join(CFG.out, `${rec.id}.mp4`))
    util.progress('[FFMPEG] Done!', 2)

    console.log(`[${util.time(time)}] >> ${ph.basename(CFG.out)}/${rec.id}.mp4`)
  }

  await dr.exit()

  await new Promise(resolve => setTimeout(resolve, 3000))

  if (fs.existsSync(TMP)) fs.rmSync(TMP, { recursive: true, force: true })
}

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

function hasMap (name) {
  for (let path of ['maps', 'download/maps']) {
    let maps = fs.readdirSync(ph.join(dr.game.dir, path))
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

let args = process.argv.slice(2)
if (!args.length) console.log('Usage: temrec [id...]')
else main(args)
