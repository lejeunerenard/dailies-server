const url = require('url')
const http = require('http')
const path = require('path')
const fs = require('fs')
const { EventEmitter } = require('events')
const DailiesDB = require('@lejeunerenard/dailies-db')
const bb = require('braille-binary')

class DailiesServer extends EventEmitter {
  constructor () {
    super()
    this.db = new DailiesDB()
    this.server = http.createServer((req, res) => {
      let uri = url.parse(req.url).pathname

      console.log('uri', uri)
      if (uri === '/latest/media') {
        this.db.list().then((dailies) => {
          dailies = dailies.sort((a, b) => (new Date(b.date)) - (new Date(a.date)))
          let media = dailies[0].media
          if (!(media && media.length)) {
            res.writeHead(404, { 'Content-Type': 'text/plain' })
            res.write('404 Not Found')
            res.end()
          } else {
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.write(JSON.stringify(media.length))
            res.end()
          }
        })
      } else if (uri.match(/\/latest\/media\/(\d+)/)) {
        let mediaIndex = uri.match(/\/latest\/media\/(\d+)/)[1]
        console.log('mediaIndex', mediaIndex)
        this.db.list().then((dailies) => {
          dailies = dailies.sort((a, b) => (new Date(b.date)) - (new Date(a.date)))
          let media = dailies[0].media
          if (!(media && media.length)) {
            res.writeHead(404, { 'Content-Type': 'text/plain' })
            res.write('404 Not Found')
            res.end()
          } else {
            // Only return the requested version
            fs.createReadStream(media[mediaIndex])
              .pipe(res)
              .on('close', () => {
                this.emit('download', `latest/${mediaIndex}`)
              })
          }
        })
      } else if (uri === '/latest/index-id') {
        this.db.list().then((dailies) => {
          dailies = dailies.sort((a, b) => (new Date(b.date)) - (new Date(a.date)))
          let index = dailies[0].dailyIndex
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
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' })
        res.write('404 Not Found\n')
        res.end()
      }
    }).listen(process.env.PORT || 8000)
  }

  close () {
    this.server.close()
  }
}

module.exports = DailiesServer
