export const getCrossingNumber = (id) => {
  /**
   * This number represents (approximately)
   * the number of crossings between the "Bataille de la Marne"
   * (13th September 1914) and the first instalment of the play
   * (22nd December 2018), counting 33 crossings a day every day
   */
  const baseNumber = 1256839
  const crossingId = id ?? 0

  return baseNumber + crossingId
}
