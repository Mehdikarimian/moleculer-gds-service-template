const tunebox = require('tunebox')
tunebox.init(require('./config'))

const logger = require('./logger')

module.exports = {
  namespace: 'bienteha',
  nodeID: null,

  logger: bindings => logger(bindings, 'info'),
  logLevel: 'info',

  transporter: 'NATS',

  cacher: {
    type: 'Redis',
    options: {
      ttl: 5
    }
  },

  serializer: 'JSON',

  requestTimeout: 50 * 10000,
  retryPolicy: {
    enabled: false,
    retries: 5,
    delay: 100,
    maxDelay: 1000,
    factor: 2,
    check: err => err && !!err.retryable
  },
  maxCallLevel: 100,
  heartbeatInterval: 5,
  heartbeatTimeout: 15,

  tracking: {
    enabled: false,
    shutdownTimeout: 5000
  },

  disableBalancer: false,

  registry: {
    strategy: 'RoundRobin',
    preferLocal: true
  },

  circuitBreaker: {
    enabled: true,
    threshold: 0.5,
    windowTime: 60,
    minRequestCount: 20,
    halfOpenTime: 10 * 1000,
    check: err => err && err.code >= 500
  },

  bulkhead: {
    enabled: false,
    concurrency: 10,
    maxQueueSize: 100
  },

  validation: true,
  validator: null,

  metrics: true,
  metricsRate: 1,

  internalServices: true,
  internalMiddlewares: true,

  hotReload: false,

  replCommands: null,

  // Register middlewares
  middlewares: [],

  // Called after broker created.
  created (broker) {},

  // Called after broker starte.
  started (broker) {},

  // Called after broker stopped.
  stopped (broker) {
    broker.logger.close()
  }
}
