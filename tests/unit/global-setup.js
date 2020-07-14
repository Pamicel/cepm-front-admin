const bodyParser = require('body-parser')
const { createProxyMiddleware } = require('http-proxy-middleware')
const axios = require('axios')
const app = require('express')()

app.use((request, response, next) => {
  response.header('Access-Control-Allow-Origin', '*')
  next()
})

app.use(bodyParser.json())

if (!process.env.API_BASE_URL) {
  console.error('variable API_BASE_URL not set')
  process.exit(1)
}

app.use('/', createProxyMiddleware({ target: process.env.API_BASE_URL }))

const createServer = async () => {
  return new Promise((resolve) => {
    const server = app.listen(process.env.MOCK_API_PORT, () => resolve(server))
  })
}

module.exports = () => {
  return (async () => {
    const pingUrl = `${process.env.API_BASE_URL}/ping`
    const devPingUrl = `${process.env.API_BASE_URL}/dev`
    const resetUrl = `${process.env.API_BASE_URL}/reset`

    try {
      await axios.get(devPingUrl)
    } catch (error) {
      throw new Error(
        `
        ${devPingUrl} is unattainable
        You might want to reboot the auth-layer in development mode:
        $ make dev-auth
        `
      )
    }

    try {
      const response = await axios.get(pingUrl)
      if (response.data.mode === 'testing') {
        global.mockApiServer = await createServer()
        await axios.get(resetUrl)
      } else {
        throw new Error(
          `
          Core api is not in testing mode
          You might want to reboot the core api in testing mode:
          $ make start-api-test
          `
        )
      }
    } catch (error) {
      if (
        error &&
        error.response &&
        error.response.config &&
        error.response.config.url === pingUrl
      ) {
        throw new Error(
          `
          Core api is unattainable
          You might want to reboot the core api in testing mode:
          $ make start-api-test
          `
        )
      }
      throw new Error(error)
    }
  })()
}
