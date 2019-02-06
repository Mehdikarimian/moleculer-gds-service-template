const logger = require('../utils/logger')
const { MoleculerError } = require('moleculer').Errors

module.exports = class ServicesError extends MoleculerError {
  constructor (message, action, category, data = {}, retryable = false, type = 'Service Error', code = 500) {
    super(message, code, type)
    this.message = message
    this.data = data
    this.retry = retryable
    this.action = action
    this.category = category
    this.code = code
    this.type = type
    logger._error(action, category, data, message)
  }
}
