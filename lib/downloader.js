let fs = require('fs')
let ph = require('path')
let m = {
  'http:': require('http'),
  'https:': require('https')
}

module.exports = async (url, dest, progress) => {
  let u = new URL(url)
  let out = ph.resolve(dest, u.pathname.split('/').at(-1))
  let file = fs.createWriteStream(out, 'binary')
  return new Promise((resolve, reject) => {
    let req = m[u.protocol].request(u, res => {
      if (res.statusCode >= 400) return reject(res.statusCode)
      let len = res.headers['content-length']
      let total = 0
      res.on('data', chunk => {
        total += chunk.length
        file.write(chunk)
        progress(Number((total * 100 / len).toFixed(2)))
      })
      res.on('end', () => file.end())
      file.on('close', () => resolve(out))
    })
    req.on('error', reject)
    req.end()
  })
}
