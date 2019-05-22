const fs = require('fs')
module.exports = {
  check: (uri) => uri.match(/\/latest\/media\/(\d+)/),
  respond: function (uri, req, res) {
    let mediaIndex = uri.match(/\/latest\/media\/(\d+)/)[1]
    this.db.latest().then((daily) => {
      let media = daily.media
      if (!(media && media.length)) {
        res.writeHead(404, { 'Content-Type': 'text/plain' })
        res.write('404 Not Found')
        res.end()
      } else {
        // Only return the requested version
        fs.createReadStream(this.db.getDailyMedia(daily, mediaIndex))
          .pipe(res)
          .on('close', () => {
            this.emit('download', `latest/${mediaIndex}`)
          })
      }
    })
  }
}
