const Logger = require('../utils/logger')
const { config } = require('tunebox')

module.exports = {
  name: 'logger',
  created () {
    Logger.Start(config.loggerConfig)
    this.logger = Logger
  },
  stopped () {
    this.db.close()
  }
}
