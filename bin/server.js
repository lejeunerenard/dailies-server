const DailiesServer = require('../')
const DailiesDB = require('./ljr-dailies-db')

let server = new DailiesServer(new DailiesDB)
server.on('download', (which) => console.log('which', which))
