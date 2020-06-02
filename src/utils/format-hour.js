// https://date-fns.org/docs/format
import format from 'date-fns/format'

export default function formatHour(date) {
  return format(date, 'H:mm')
}
