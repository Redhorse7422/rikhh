import { createLogger, format, transports, addColors } from 'winston'

addColors({
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6,
  } as never,
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    verbose: 'cyan',
    debug: 'blue',
    silly: 'white',
  } as never,
})

export const logger = createLogger({
  level: process.env.LOGGING_LEVEL || 'debug',
  format: format.combine(
    format.colorize(),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf((info) => {
      const { timestamp, level, message, ...extra } = info
      const extraSplat = extra[Symbol.for('splat')]
      const extraSplatString = extraSplat ? ` ${JSON.stringify(extraSplat, null, 2)}` : ''
      // const meta = Object.keys(extra).length ? JSON.stringify(extra) : ''

      // return `${timestamp} [${level}]: ${message} | ${meta}`;
      return `${timestamp} [${level}]: ${message}${extraSplatString}`
    }),
  ),
  defaultMeta: { service: 'internal' },
  transports: [
    new transports.Console({ colorize: true } as never),
    // new winston.transports.File({ filename: 'combined.log' })
  ],
})
