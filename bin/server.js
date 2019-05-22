const DailiesServer = require('../')
const DailiesDB = require('./ljr-dailies-db')
const bb = require('braille-binary')

let server = new DailiesServer(new DailiesDB)
server.on('download', (which) => console.log('which', which))
server.use({
  check: (uri) => uri === '/latest/index-id',
  respond: function (uri, req, res) {
    this.db.latest().then((daily) => {
      let index = daily.dailyIndex
      if (!index) {
        res.writeHead(404, { 'Content-Type': 'text/plain' })
        res.write('404 Not Found')
        res.end()
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.write(JSON.stringify(bb(index) + '|'))
        res.end()
      }
    })
  }
})
server.run()
