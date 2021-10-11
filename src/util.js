let timer = {
  time: null,
  text: null,
  handle: null
}

module.exports = {
  formatTime (ms, decimals = 3) {
    if (!ms) return null
    ms = ms / 1000
    let s = Math.floor(ms % 60)
    let m = Math.floor(ms / 60 % 60)
    let h = Math.floor(ms / 60 / 60)
    if (!h) h = null
    else if (!m) m = '00'
    if (!s) s = '00'
    let t = [h, m, s].filter(x => x !== null).map((x, i, a) => {
      return (i !== 0 && x < 10 && x !== '00') ? '0' + x : x
    })
    ms = ms.toString()
    return t.join(':') + (decimals ? ms.substr(ms.indexOf('.'), decimals + 1) : '')
  },
  write (msg) {
    process.stdout.cursorTo(0)
    process.stdout.clearLine()
    process.stdout.write(msg)
  },
  progress (msg, type = 1) {
    timer.text = msg
    switch (type) {
      case 0: {
        timer.text += '\n'
        this.write(`[${this.time(null)}] ` + timer.text)
        break
      }
      case 1: {
        if (!timer.handle) {
          timer.time = Date.now()
          timer.handle = setInterval(() => this.write(`[${this.time(timer.time)}] ` + timer.text), 100)
        }
        break
      }
      case 2: {
        timer.text += '\n'
        clearInterval(timer.handle)
        timer.handle = null
        this.write(`[${this.time(timer.time)}] ` + timer.text)
      }
    }
  },
  time (ms) {
    return ms ? new Date(Date.now() - ms).toISOString().slice(11, 19) : '00:00:00'
  }
}
