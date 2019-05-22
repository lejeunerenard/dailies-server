const DailiesServer = require('../')
const DailiesDB = require('@lejeunerenard/dailies-db-json')

let server = new DailiesServer(new DailiesDB)
server.run()
