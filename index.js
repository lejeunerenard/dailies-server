const url = require('url')
const http = require('http')
const fs = require('fs')
const { EventEmitter } = require('events')
const bb = require('braille-binary')

function respondNotFound (res) {
  res.writeHead(404, { 'Content-Type': 'text/plain' })
  res.write('404 Not Found')
  res.end()
}

class DailiesServer extends EventEmitter {
  constructor (db) {
    if (!db) throw Error('DailiesServer : No Database provided')

    super()

    this.db = db
    this.server = http.createServer((req, res) => {
      let uri = url.parse(req.url).pathname

      console.log('uri', uri)
      if (uri === '/latest/media') {
        this.db.latest().then((daily) => {
          let media = daily.media
          if (!(media && media.length)) {
            respondNotFound(res)
          } else {
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.write(JSON.stringify(media.length))
            res.end()
          }
        })
      } else if (uri.match(/\/latest\/media\/(\d+)/)) {
        let mediaIndex = uri.match(/\/latest\/media\/(\d+)/)[1]
        this.db.latest().then((daily) => {
          let media = daily.media
          if (!(media && media.length)) {
            respondNotFound(res)
          } else {
            // Only return the requested version
            fs.createReadStream(this.db.getDailyMedia(daily, mediaIndex))
              .pipe(res)
              .on('close', () => {
                this.emit('download', `latest/${mediaIndex}`)
              })
          }
        })
      } else if (uri === '/latest/index-id') {
        this.db.latest().then((daily) => {
          let index = daily.dailyIndex
          if (!index) {
            respondNotFound(res)
          } else {
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.write(JSON.stringify(bb(index) + '|'))
            res.end()
          }
        })
      } else {
        respondNotFound(res)
      }
    }).listen(process.env.PORT || 8000)
  }

  close () {
    this.server.close()
  }
}

module.exports = DailiesServer
