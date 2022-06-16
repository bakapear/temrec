let dp = require('despair')

let tfclass = { 3: 'S', 4: 'D' }

module.exports = {
  async getRecord (id) {
    let record = await dp(`https://tempus.xyz/api/records/id/${id}/overview`).json().catch(e => null)
    if (!record) return { error: `Record ${id} not found!` }
    if (!record.demo_info?.url) return { error: `Record ${id} does not have a demo uploaded!` }
    return {
      id: Number(id),
      url: record.demo_info.url,
      time: {
        start: record.record_info.demo_start_tick,
        end: record.record_info.demo_end_tick,
        duration: record.record_info.duration
      },
      player: {
        id: record.player_info.steamid,
        name: record.player_info.name,
        class: tfclass[record.record_info.class]
      },
      zone: {
        map: record.map_info.name,
        type: record.zone_info.type,
        index: record.zone_info.zoneindex,
        name: record.zone_info.custom_name
      }
    }
  },
  formatZone (zone) {
    if (zone.type === 'map') return zone.map
    let type = zone.type[0].toUpperCase() + zone.index
    if (zone.name) type += ` - ${zone.name}`
    return `${zone.map} [${type}]`
  },
  mapURL (map) {
    return `http://tempus.site.nfoservers.com/server/maps/${map}.bsp.bz2`
  }
}
