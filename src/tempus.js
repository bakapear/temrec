let dp = require('despair')

let util = require('./util')

let TFCLASS = { 3: 'S', 4: 'D' }

module.exports = {
  async getRecord (api, id, formatted) {
    let rec = id
    if (typeof id === 'object') id = rec.id || rec.record_info?.id
    else rec = await dp(api + `/records/id/${id}/overview`).json().catch(() => null)

    if (!rec) throw Error(`Record ${id} not found!`)
    if (!rec.demo_info?.url && !rec.demo) throw Error(`Record ${id} does not have a demo uploaded!`)

    return (formatted && !rec.display) ? this.formatRecord(rec) : rec
  },
  formatRecord (rec) {
    return {
      id: rec.record_info.id,
      rank: rec.record_info.rank,
      date: rec.record_info.date,
      class: TFCLASS[rec.record_info.class],
      zone: rec.record_info.zone_id,
      map: rec.map_info.name,
      demo: rec.demo_info.url,
      start: rec.record_info.demo_start_tick,
      end: rec.record_info.demo_end_tick,
      time: rec.record_info.duration,
      player: rec.player_info.steamid,
      nick: rec.player_info.name,
      z: {
        map: rec.zone_info.map_id,
        type: rec.zone_info.type,
        index: rec.zone_info.zoneindex,
        custom: rec.zone_info.custom_name
      },
      display: `[${TFCLASS[rec.record_info.class]}] ${rec.player_info.name} on ${rec.demo_info.mapname} ${this.formatZone(rec.zone_info)} - ${util.formatTime(rec.record_info.duration * 1000)}`
    }
  },
  mapURL (api, map) {
    return api.replace('%MAP%', map)
  },
  formatZone (zone) {
    let z = zone.type
    if (z === 'map') z = ''
    else z = `${z[0].toUpperCase()}${z.slice(1)} ${zone.zoneindex}`
    if (zone.custom_name) z += ` (${util.maxLen(zone.custom_name, 30)})`
    return z
  }
}
