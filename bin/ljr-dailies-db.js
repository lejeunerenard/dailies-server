const DailiesDB = require('../dailies-db')
const ljrDB = require('@lejeunerenard/dailies-db')

class LJRDailiesDB extends DailiesDB {
  constructor () {
    super()
    this.db = new ljrDB()
  }

  latest () {
    return this.db.list().then((dailies) => {
      dailies = dailies.sort((a, b) => (new Date(b.date)) - (new Date(a.date)))
      return dailies[0]
    })
  }
}

module.exports = LJRDailiesDB
