const { MongoClient } = require('mongodb')
const { config } = require('tunebox')
const Logstash = require('safe-logstash-client')
const Pino = require('pino')

class Logger {
  setCriticalActions (actions) {
    this.actions = actions
  }

  async Start (LoggerConfig) {
    this.MongoConnect()

    this.config = LoggerConfig
    this.logstash = new Logstash({
      type: 'tcp', // udp, tcp, memory
      host: config.logger.host,
      port: config.logger.port
    })
  }

  async MongoConnect () {
    const { host, port, name } = config.db
    this.client = await MongoClient.connect(
      `${host}:${port}`,
      { useNewUrlParser: true }
    )
    this.db = this.client.db(name)
  }

  MongoLogger (action, category, level, payload, message) {
    this.db.collection(`logs`).insertOne({
      message: message || '',
      category,
      action,
      level,
      payload,
      created_at: new Date()
    })
  }

  LogstashLogger (action, category, level, payload, message) {
    this.logstash.send({
      message,
      node_id: 'dataset',
      action,
      category,
      level,
      context: payload
    })
  }

  PinoLogger (action, category, level, payload, message) {
    const pinoLog = Pino({
      level,
      prettyPrint: {
        levelFirst: true
      }
    })

    if (this.config.pinoActions.includes(action) || category === 'error') {
      pinoLog[level](
        { action, category, context: payload, timeStamp: new Date() },
        message || `In Action:${action} On Category:${category}`
      )
    }
  }

  logger (action, category, level, payload, message = null) {
    if (this.config.mongoActions.includes(action)) {
      this.MongoLogger(action, category, level, payload, message)
    }
    this.LogstashLogger(action, category, level, payload, message)
  }

  _trace (action, category, payload, message = null) {
    this.PinoLogger(action, category, 'trace', payload, message)
    this.logger(action, category, 'trace', payload, message)
  }

  _debug (action, category, payload, message = null) {
    this.PinoLogger(action, category, 'debug', payload, message)
    this.logger(action, category, 'debug', payload, message)
  }

  _info (action, category, payload, message = null) {
    this.PinoLogger(action, category, 'info', payload, message)
    this.logger(action, category, 'info', payload, message)
  }

  _warn (action, category, payload, message = null) {
    this.MongoLogger(action, category, 'warn', payload, message)
    this.PinoLogger(action, category, 'warn', payload, message)
    this.LogstashLogger(action, category, 'warn', payload, message)
  }

  _error (action, category, payload, message = null) {
    this.MongoLogger(action, category, 'error', payload, message)
    this.PinoLogger(action, category, 'error', payload, message)
    this.LogstashLogger(action, category, 'error', payload, message)
  }

  _fatal (action, category, payload, message = null) {
    this.MongoLogger(action, category, 'fatal', payload, message)
    this.PinoLogger(action, category, 'fatal', payload, message)
    this.LogstashLogger(action, category, 'fatal', payload, message)
  }
}

module.exports = new Logger()
