import dayjs from 'dayjs'
import 'dayjs/locale/th'
import buddhistEra from 'dayjs/plugin/buddhistEra'

dayjs.extend(buddhistEra)

export const toDateBase = (date: Date) => {
  return dayjs(date).format('DD/MM/YYYY')
}

export const toDateTimeBase = (date: Date) => {
  return dayjs(date).format('DD/MM/YYYY HH:mm:ss')
}

export const toDateTimeNoSecBase = (date: Date) => {
  return dayjs(date).format('DD/MM/YYYY HH:mm')
}

export const toTimeBase = (date: Date) => {
  return dayjs(date).format('HH:mm:ss')
}

export const toTimeShortBase = (date: Date) => {
  return dayjs(date).format('HH:mm')
}

export const toDateLong = (date: Date) => {
  return dayjs(date).format('DD MMMM BBBB')
}

export const toDateTimeLong = (date: Date) => {
  return dayjs(date).format('DD MMMM BBBB HH:mm:ss')
}

export const toDateShort = (date: Date) => {
  return dayjs(date).format('DD MMM BB')
}

export const toDateTimeShort = (date: Date) => {
  return dayjs(date).format('DD MMM BB HH:mm:ss')
}

export const dateStatus = (date: Date) => {
  const now = dayjs()
  const targetDate = dayjs(date)

  if (targetDate.isSame(now, 'day')) {
    return 'today'
  } else if (targetDate.isBefore(now, 'day')) {
    return 'ended'
  } else if (targetDate.isBefore(now.add(1, 'day'), 'day')) {
    return 'within_1_day'
  } else if (targetDate.isBefore(now.add(1, 'week'), 'day')) {
    return 'within_1_week'
  } else if (targetDate.isBefore(now.add(1, 'month'), 'day')) {
    return 'ongoing'
  }

  return 'upcoming'
}
