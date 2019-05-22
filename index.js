const url = require('url')
const http = require('http')
const { EventEmitter } = require('events')

const latestMedia = require('./routes/latest-media')
const latestMediaDownload = require('./routes/latest-media-download')

class DailiesServer extends EventEmitter {
  constructor (db) {
    if (!db) throw Error('DailiesServer : No Database provided')

    super()

    this.db = db

    // Routes
    let defaultRoutes = [
      latestMedia,
      latestMediaDownload
    ]
    this.routes = defaultRoutes
  }

  use (route) {
    this.routes.push(route)
  }

  run () {
    this.server = http.createServer((req, res) => {
      let uri = url.parse(req.url).pathname

      console.log('uri', uri)
      for (let route of this.routes) {
        if (route.check(uri)) {
          route.respond.bind(this)(uri, req, res)
          return
        }
      }

      res.writeHead(404, { 'Content-Type': 'text/plain' })
      res.write('404 Not Found')
      res.end()
    }).listen(process.env.PORT || 8000)
  }

  close () {
    this.server.close()
  }
}

module.exports = DailiesServer
