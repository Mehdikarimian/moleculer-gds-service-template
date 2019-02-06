
module.exports = {
  db: {
    host: process.env.DB_HOST || 'mongodb://mongo',
    port: process.env.DB_PORT || '27017',
    name: process.env.DB_NAME || '{{projectName}}'
  },
  logger: {
    host: process.env.LOGGER_HOST || 'logstash',
    port: process.env.LOGGER_PORT || 9988
  },
  nats: {
    host: process.env.TRANSPORTER_HOST || 'nats://nats',
    port: process.env.TRANSPORTER_PORT || 4222
  },
  redis: {
    host: process.env.CACHER_HOST || 'http://redis',
    port: process.env.CACHER_PORT || 6379
  },
  loggerConfig: {
    mongoActions: [],
    pinoActions: []
  }
}
