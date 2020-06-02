const Users = require('../resources/users')
const Performances = require('../resources/performances')

module.exports = (app) => {
  app.get('/api/performances/:id', (request, response) => {
    const currentUser = Users.findBy('token', request.headers.authorization)

    if (!currentUser) {
      return response.status(401).json({
        message:
          'The token is either invalid or has expired. Please log in again.',
      })
    }

    const matchedPerformance = Performances.findBy('id', request.params.id)

    if (!matchedPerformance) {
      return response.status(400).json({
        message: 'No user with this name was found.',
      })
    }

    response.json(matchedPerformance)
  })
  app.get('/api/performances', (request, response) => {
    const currentUser = Users.findBy('token', request.headers.authorization)

    if (!currentUser) {
      return response.status(401).json({
        message:
          'The token is either invalid or has expired. Please log in again.',
      })
    }

    response.json(Performances.all)
  })
}
