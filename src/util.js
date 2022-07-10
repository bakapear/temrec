let fs = require('fs')

module.exports = {
  remove (paths) {
    if (!Array.isArray(paths)) paths = [paths]
    for (let path of paths) {
      if (path && fs.existsSync(path)) fs.rmSync(path, { force: true, recursive: true })
    }
  },
  formatTime (ms, decimals = 3) {
    if (!ms) return null
    ms = ms / 1000
    let s = Math.floor(ms % 60)
    let m = Math.floor(ms / 60 % 60)
    let h = Math.floor(ms / 60 / 60)
    if (!h) h = null
    else if (!m) m = '00'
    if (!s) s = '00'
    let t = [h, m, s].filter(x => x !== null).map((x, i) => {
      return (i !== 0 && x < 10 && x !== '00') ? '0' + x : x
    })
    ms = ms.toString()
    return t.join(':') + (decimals ? ms.substr(ms.indexOf('.'), decimals + 1) : '')
  },
  maxLen (str, len) {
    if (str.length > len) str = str.slice(0, len - 3).trim() + '...'
    return str
  },
  time (ms) {
    return ms ? new Date(Date.now() - ms).toISOString().slice(11, 19) : '00:00:00'
  }
}
