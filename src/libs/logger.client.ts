export const logger = {
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
