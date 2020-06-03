module.exports = {
  all: require('./spectators.json'),
  filterByCrossing(crossing) {
    const matchedPerf = this.all.filter(
      (performance) => performance.crossing === crossing
    )
    return this.json(matchedPerf)
  },
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
