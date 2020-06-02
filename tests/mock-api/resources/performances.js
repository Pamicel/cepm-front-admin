module.exports = {
  all: [
    {
      id: 1,
      duration: 90,
      date: new Date('2020-05-20T20:30'),
      audience: 50,
    },
    {
      id: 2,
      duration: 90,
      date: new Date('2020-05-20T18:00'),
      audience: 50,
    },
  ],
  findBy(propertyName, value) {
    const matchedPerf = this.all.find(
      (performance) => performance[propertyName] === value
    )
    return this.json(matchedPerf)
  },
  json(performance) {
    return performance
  },
}
