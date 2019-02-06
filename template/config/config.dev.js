module.exports = {
  db: {
    host: process.env.DB_HOST || 'mongodb://127.0.0.1',
    port: process.env.DB_PORT || '27017',
    name: process.env.DB_NAME || '{{projectName}}'
  },
  logger: {
    host: process.env.LOGGER_HOST || '127.0.0.1',
    port: process.env.LOGGER_PORT || 9988
  },
  nats: {
    host: process.env.TRANSPORTER_HOST || 'nats://127.0.0.1',
    port: process.env.TRANSPORTER_PORT || 4222
  },
  redis: {
    host: process.env.CACHER_HOST || 'http://127.0.0.1',
    port: process.env.CACHER_PORT || 6379
  },
  loggerConfig: {
    mongoActions: [],
    pinoActions: []
  }
}
