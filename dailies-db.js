class DailiesDB {
  latest () {
    throw Error('DailiesDB : latest() not implemented')
  }

  getDailyMedia (daily, index) {
    return daily.media[index]
  }
}
module.exports = DailiesDB
