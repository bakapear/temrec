let fs = require('fs')

module.exports = {
  remove (paths) {
    if (!Array.isArray(paths)) paths = [paths]
    for (let path of paths) {
      if (path && fs.existsSync(path)) fs.rmSync(path, { force: true, recursive: true })
    }
  },
  formatTime (ms, decimals = 3) {
    if (!ms) return '0:00' + (decimals ? '.' + '0'.repeat(decimals) : '')

    let invert = false

    if (ms < 0) {
      invert = true
      ms = Math.abs(ms)
    }

    ms = ms / 1000
    let s = Math.floor(ms % 60)
    let m = Math.floor(ms / 60 % 60)
    let h = Math.floor(ms / 60 / 60)

    if (!h) h = null
    else if (!m) m = '00'
    if (!s) s = '00'

    let t = [h, m, s].filter(x => x !== null).map((x, i) => (i !== 0 && x < 10 && x !== '00') ? '0' + x : x)

    let decs = (ms % 1).toString().slice(2)
    decs = decs + '0'.repeat(16 - decs.length)

    return (invert ? '-' : '') + t.join(':') + (decimals ? '.' + decs.slice(0, decimals) : '')
  },
  maxLen (str, len) {
    if (str.length > len) str = str.slice(0, len - 3).trim() + '...'
    return str
  },
  time (ms) {
    return ms ? new Date(Date.now() - ms).toISOString().slice(11, 19) : '00:00:00'
  }
}
