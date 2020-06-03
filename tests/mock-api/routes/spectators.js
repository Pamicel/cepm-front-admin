const Users = require('../resources/users')
const Spectators = require('../resources/spectators')
const Performances = require('../resources/performances')

module.exports = (app) => {
  app.get('/api/spectators/:id', (request, response) => {
    const currentUser = Users.findBy('token', request.headers.authorization)

    if (!currentUser) {
      return response.status(401).json({
        message:
          'The token is either invalid or has expired. Please log in again.',
      })
    }

    const id = parseInt(request.params.id)
    const matchedSpectator = Spectators.findBy('id', id)

    if (!matchedSpectator) {
      return response.status(400).json({
        message: 'No spectator with this id was found.',
      })
    }

    response.json(matchedSpectator)
  })
  app.get('/api/spectators', (request, response) => {
    const currentUser = Users.findBy('token', request.headers.authorization)

    if (!currentUser) {
      return response.status(401).json({
        message:
          'The token is either invalid or has expired. Please log in again.',
      })
    }

    // If no crossing is specified, respond with all the spectators
    if (!request.query.crossing) {
      return response.json(Spectators.all)
    }

    // Check that the crossing exists
    const id = parseInt(request.query.crossing)
    const matchedPerf = Performances.findBy('id', id)
    if (!matchedPerf) {
      return response.status(400).json({
        message: 'No crossing with this id was found.',
      })
    }

    // Respond with the spectators that are part of this crossing
    return response.json(Spectators.filterByCrossing(id))
  })
}
