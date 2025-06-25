import { createLogger, format, transports, addColors } from 'winston'

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined'

// Client-safe logger for browser environments
const clientLogger = {
  error: (message: string, ...args: unknown[]) => {
    console.error(`[ERROR] ${message}`, ...args)
  },
  warn: (message: string, ...args: unknown[]) => {
    console.warn(`[WARN] ${message}`, ...args)
  },
  info: (message: string, ...args: unknown[]) => {
    console.info(`[INFO] ${message}`, ...args)
  },
  debug: (message: string, ...args: unknown[]) => {
    console.debug(`[DEBUG] ${message}`, ...args)
  },
}

// Server-side Winston logger
if (!isBrowser) {
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
}

const winstonLogger = isBrowser
  ? null
  : createLogger({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.errors({ stack: true }),
        format.json(),
      ),
      defaultMeta: { service: 'aura-wellness' },
      transports: [
        new transports.Console({
          format: format.combine(format.colorize(), format.simple()),
        }),
      ],
    })

// Export the appropriate logger based on environment
export const logger = isBrowser ? clientLogger : winstonLogger!
