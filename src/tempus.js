let dp = require('despair')

let util = require('./util')

let base = 'https://tempus.xyz/api'
let TFCLASS = { 3: 'S', 4: 'D' }

module.exports = {
  async getRecord (id, formatted) {
    let rec = await dp(base + `/records/id/${id}/overview`).json().catch(() => null)
    if (!rec) throw Error(`Record ${id} not found!`)
    if (!rec.demo_info?.url) throw Error(`Record ${id} does not have a demo uploaded!`)
    return formatted ? this.formatRecord(rec, id) : rec
  },
  formatRecord (rec, id) {
    return {
      id,
      map: rec.map_info.name,
      demo: rec.demo_info.url,
      start: rec.record_info.demo_start_tick,
      end: rec.record_info.demo_end_tick,
      time: rec.record_info.duration,
      player: rec.player_info.steamid,
      display: `[${TFCLASS[rec.record_info.class]}] ${rec.player_info.name} on ${rec.demo_info.mapname} ${this.formatZone(rec.zone_info)} - ${util.formatTime(rec.record_info.duration * 1000)}`
    }
  },
  mapURL (map) {
    return `http://tempus.site.nfoservers.com/server/maps/${map}.bsp.bz2`
  },
  formatZone (zone) {
    let z = zone.type
    if (z === 'map') z = ''
    else z = `${z[0].toUpperCase()}${z.slice(1)} ${zone.zoneindex}`
    if (zone.custom_name) z += ` (${util.maxLen(zone.custom_name, 30)})`
    return z
  }
}
