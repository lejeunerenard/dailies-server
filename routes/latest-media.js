module.exports = {
  check: (uri) => uri === '/latest/media',
  respond: function (uri, req, res) {
    this.db.latest().then((daily) => {
      let media = daily.media
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
  }
}
