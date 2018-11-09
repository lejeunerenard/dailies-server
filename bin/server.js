const DailiesServer = require('../')

let server = new DailiesServer()
server.on('download', (which) => console.log('which', which))
