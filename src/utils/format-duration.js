export default function formatDuration(duration) {
  const hourInMinutes = 60
  const dayInMinutes = 24 * 60
  const minuteDiff = duration

  if (minuteDiff >= hourInMinutes) {
    const hours = Math.floor((minuteDiff % dayInMinutes) / hourInMinutes)
    const minutes = `${minuteDiff % hourInMinutes}`.padStart(2, '0')

    return `${hours}h${minutes}min`
  }

  return `${minuteDiff}min`
}
