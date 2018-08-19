const net = require('net')
const stringify = require('fast-safe-stringify')
const pino = require('pino')
const { config } = require('tunebox')

const client = new net.Socket()
client.connect(config.logger.port, config.logger.host)

module.exports = (bindings, level) => {
  const levels = {
    trace: 0,
    debug: 1,
    info: 2,
    warn: 3,
    error: 4,
    fatal: 5
  }
  const logger = pino({
    level,
    prettyPrint: {
      levelFirst: true
    }
  })
  const levelsArray = Object.keys(levels)
  level = levels[level]
  const send = (context, category, payload, level) => {
    const log = {
      request_id: context.id,
      node_id: context.nodeID,
      namespace: bindings.ns,
      timestamp: new Date(),
      service: bindings.svc,
      version: bindings.ver || 0,
      pid: process.pid,
      action: context.action.name,
      settings: context.action.service.settings,
      params: context.params,
      timeout: context.timeout,
      retry_count: context.retryCount,
      parent_node: context.parentID,
      caller_node: context.callerNodeID,
      cached_result: context.cachedResult,
      category,
      payload,
      level: levelsArray[level]
    }

    client.write(stringify(log))
    client.write('\n')
  }
  return {
    _trace: (context, category, payload) => {
      level > levels.trace || send(context, category, payload, levels.trace)
    },
    _debug: (context, category, payload) => {
      level > levels.debug || send(context, category, payload, levels.debug)
    },
    _info: (context, category, payload) => {
      level > levels.info || send(context, category, payload, levels.info)
    },
    _warn: (context, category, payload) => {
      level > levels.warn || send(context, category, payload, levels.warn)
    },
    _error: (context, category, payload) => {
      level > levels.error || send(context, category, payload, levels.error)
    },
    _fatal: (context, category, payload) => {
      level > levels.fatal || send(context, category, payload, levels.fatal)
    },
    trace: (...args) => {
      logger.trace({ ...args, ...bindings }, args[0])
    },
    debug: (...args) => {
      logger.debug({ ...args, ...bindings }, args[0])
    },
    info: (...args) => {
      logger.info({ ...args, ...bindings }, args[0])
    },
    warn: (...args) => {
      logger.warn({ ...args, ...bindings }, args[0])
    },
    error: (...args) => {
      logger.error({ ...args, ...bindings }, args[0])
    },
    fatal: (...args) => {
      logger.fatal({ ...args, ...bindings }, args[0])
    },
    close: () => {
      client.destroy()
    }
  }
}
