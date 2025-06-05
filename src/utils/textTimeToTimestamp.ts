export const textTimeToTimestamp = (textTime: string, isSecond?: boolean): number => {
  try {
    const timePattern = /^(\d+)(ms|s|m|h|d)$/
    const match = textTime.match(timePattern)

    if (!match) throw new Error('Invalid time format')

    let value = Number(parseInt(match[1], 10))
    const unit = match[2]

    switch (unit) {
      case 'ms':
        value = value
        break
      case 's':
        value = value * 1000
        break
      case 'm':
        value = value * 1000 * 60
        break
      case 'h':
        value = value * 1000 * 60 * 60
        break
      case 'd':
        value = value * 1000 * 60 * 60 * 24
        break
    }

    if (isSecond) return value / 1000
    return value
  } catch (error) {
    console.error('Error in converting text time to timestamp: ', error)
    throw error
  }
}

export const textTimeToTimestampFromNow = (textTime: string, isSecond?: boolean): number => {
  try {
    const currentTimestamp = Date.now()
    const timeOffset = textTimeToTimestamp(textTime, isSecond)
    return currentTimestamp + timeOffset
  } catch (error) {
    console.error('Error in converting text time to timestamp from now: ', error)
    throw error
  }
}
