const bodyParser = require('body-parser')
const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = (app, url) => {
  app.use(bodyParser.json())
  app.use('/', createProxyMiddleware({ target: url }))
}
