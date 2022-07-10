let readline = require('readline')
let util = require('./util')

function write (msg) {
  readline.clearLine(process.stdout, 0)
  readline.cursorTo(process.stdout, 0)
  process.stdout.write(msg)
}

function doing (act) {
  act = act[0].toUpperCase() + act.slice(1).toLowerCase()
  if (['p'].includes(act.at(-1))) act += act.at(-1)
  return act + 'ing'
}

function Logger (events) {
  let Events = Object.keys(events)
  let SWAPS = [events.GAME_LAUNCH_END, events.MAP_EXTRACT_END, events.DEMO_EXTRACT_END, events.DEMO_DONE, events.FFMPEG_DONE, events.GAME_EXIT_END]
  let VID = [events.DEMO_LAUNCH, events.DEMO_DONE]
  let REP = { GAME: 'Game', MAP: 'Map', DEMO: 'Demo', VIDEO: 'Video', FFMPEG: 'FFMPEG' }

  let timer = {
    time: null,
    txt: null,
    overflow: 0,
    loop: () => {
      if (timer.time) {
        timer.overflow++
        if (timer.overflow >= 2) return timer.overflow--
        timer.action()
        setTimeout(() => {
          timer.overflow--
          timer.loop()
        }, 1000)
      }
    },
    action: (nl) => {
      write(`[${util.time(timer.time)}] ${timer.txt}` + (nl ? '\n' : ''))
    },
    start: () => {
      timer.time = Date.now()
      timer.loop()
    },
    set: (msg, last) => {
      timer.txt = msg.trim()
      timer.action(last)
      if (last) timer.end()
    },
    end: () => {
      timer.time = null
    }
  }

  // TODO: timer hell

  this.onlog = data => {
    let swap = SWAPS.includes(data.event) ? '\n' : ''
    let [head, action, end] = Events[data.event].split('_')

    if (end && !swap) return

    if (data.event >= VID[0] && data.event <= VID[1]) head = 'VIDEO'
    head = REP[head]

    if (data.index) head += ` ${data.index}/${data.total}`

    let progress = data.progress || ''
    if (progress) progress += '%'

    let act = doing(action) + '...'

    if (swap) {
      act = 'Done!'
      progress = ''
    }

    timer.set(`[${head}] ${act} ${progress}`, swap)
    if (data.event === events.GAME_EXIT_END) timer.end()
    else if (!timer.time) timer.start()
  }
}

module.exports = Logger
