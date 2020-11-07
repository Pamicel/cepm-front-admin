const axios = require('axios')

module.exports = () => {
  return (async () => {
    if (!process.env.API_BASE_URL) {
      throw new Error('Please provide the API_BASE_URL environment variable')
    }

    const pingUrl = `${process.env.API_BASE_URL}/api/ping`
    const devPingUrl = `${process.env.API_BASE_URL}/api/dev`
    const resetUrl = `${process.env.API_BASE_URL}/api/reset`

    try {
      await axios.get(devPingUrl)
    } catch (error) {
      throw new Error(
        `
        ${devPingUrl} is unattainable
        You might want to reboot the auth-layer in testing mode:
        $ make start-auth-test
        `
      )
    }

    try {
      const response = await axios.get(pingUrl)
      if (response.data.mode === 'testing') {
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
