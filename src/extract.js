let fs = require('fs')
let ph = require('path')
let stream = require('stream')
let unbzip = require('../lib/unbzip2-stream')
let unzipit = require('../lib/unzipit')

module.exports = {
  async bz2 (source, dest, progress) {
    let { size } = fs.statSync(source)
    let from = fs.createReadStream(source)
    let to = fs.createWriteStream(dest)

    let total = 0

    let log = new stream.Transform({
      transform (chunk, _, callback) {
        total += chunk.length
        progress(Number((total * 100 / size).toFixed(2)))
        this.push(chunk)
        callback()
      }
    })

    from.pipe(log).pipe(unbzip()).pipe(to)

    return new Promise(resolve => to.on('finish', resolve))
  },
  async zip (source, dest) {
    let data = fs.readFileSync(source)
    let zip = await unzipit.unzip(data)
    let file = Object.values(zip.entries)[0]
    dest = ph.join(dest, file.name)
    data = await file.arrayBuffer()
    fs.writeFileSync(dest, Buffer.from(data))
    return dest
  }
}
