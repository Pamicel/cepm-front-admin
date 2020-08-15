import axios from 'axios'
import * as authModule from './auth'

const apiUrl = `${process.env.API_BASE_URL}/api`

describe('@state/modules/auth', () => {
  it('exports a valid Vuex module', () => {
    expect(authModule).toBeAVuexModule()
  })

  describe('in a store', () => {
    let store
    beforeEach(async () => {
      store = createModuleStore(authModule)
      window.localStorage.clear()
    })

    it('mutations.SET_CURRENT_USER correctly sets axios default authorization header', () => {
      axios.defaults.headers.common.Bearer = ''

      store.commit('SET_CURRENT_USER', {
        token: 'some-token',
      })
      expect(axios.defaults.headers.common.Bearer).toEqual('some-token')

      store.commit('SET_CURRENT_USER', null)
      expect(axios.defaults.headers.common.Bearer).toEqual('')
    })

    it('mutations.SET_CURRENT_USER correctly saves currentUser in localStorage', () => {
      let savedCurrentUser = JSON.parse(
        window.localStorage.getItem('auth.currentUser')
      )
      expect(savedCurrentUser).toEqual(null)

      const expectedCurrentUser = {
        token: 'some-token',
      }
      store.commit('SET_CURRENT_USER', expectedCurrentUser)

      savedCurrentUser = JSON.parse(
        window.localStorage.getItem('auth.currentUser')
      )
      expect(savedCurrentUser).toEqual(expectedCurrentUser)
    })

    it('getters.loggedIn returns true when currentUser is an object', () => {
      store.commit('SET_CURRENT_USER', {})
      expect(store.getters.loggedIn).toEqual(true)
    })

    it('getters.loggedIn returns false when currentUser is null', () => {
      store.commit('SET_CURRENT_USER', null)
      expect(store.getters.loggedIn).toEqual(false)
    })

    it('action.logIn resolves to a user', async () => {
      const { email, password } = validUserExample

      const user = await store.dispatch('logIn', {
        email,
        password,
      })

      expect(user).toHaveProperty('id')
      expect(user).toHaveProperty('email')
      expect(user).toHaveProperty('dateCreated')

      expect(typeof user.id).toBe('number')
      expect(user.email).toEqual(validUserExample.email)

      expect(store.state.currentUser.id).toEqual(user.id)
      expect(store.state.currentUser.email).toEqual(user.email)
      expect(store.state.currentUser.dateCreated).toEqual(user.dateCreated)
      expect(store.state.currentUser.token).toBeDefined()
    })

    it('action.verify resolves to null when not logged in', async () => {
      const user = await store.dispatch('verify')
      expect(user).toEqual(null)
    })

    it('action.verify resolves to null when user has no token', async () => {
      store.commit('SET_CURRENT_USER', {
        email: validUserExample.email,
      })
      const user = await store.dispatch('verify')
      expect(user).toEqual(null)
    })

    it('action.verify resolves to null when user has a bad token', async () => {
      store.commit('SET_CURRENT_USER', {
        email: validUserExample.email,
        token: 'bla-bla-bla',
      })
      const user = await store.dispatch('verify')
      expect(user).toEqual(null)
    })

    it('action.verify removes the current user when the user has no token', async () => {
      store.commit('SET_CURRENT_USER', {
        email: validUserExample.email,
      })
      await store.dispatch('verify')
      expect(store.state.currentUser).toEqual(null)
    })

    it('action.verify removes the current user when the user has a bad token', async () => {
      store.commit('SET_CURRENT_USER', {
        email: validUserExample.email,
        token: 'bla-bla-bla',
      })
      await store.dispatch('verify')
      expect(store.state.currentUser).toEqual(null)
    })

    it('action.verify resolves to null when token is expired', async () => {
      const { email } = validUserExample

      const response = await axios.get(
        `${apiUrl}/dev/create-expired-token?email=${email}`
      )

      store.commit('SET_CURRENT_USER', {
        email: validUserExample.email,
        token: response.data.token,
      })

      const user = await store.dispatch('verify')
      expect(user).toEqual(null)
    })

    it('action.verify removes the currentUser when token is expired', async () => {
      const { email } = validUserExample

      const response = await axios.get(
        `${apiUrl}/dev/create-expired-token?email=${email}`
      )

      store.commit('SET_CURRENT_USER', {
        email: validUserExample.email,
        token: response.data.token,
      })

      await store.dispatch('verify')
      expect(store.state.currentUser).toEqual(null)
    })

    it('action.verify resolves to the user when freshly logged in', async () => {
      const { email, password } = validUserExample

      const loggedInUser = await store.dispatch('logIn', {
        email,
        password,
      })
      const { token } = store.state.currentUser
      const user = await store.dispatch('verify')
      expect(user).toEqual(loggedInUser)
      expect(store.state.currentUser.token).toEqual(token)
    })

    it('action.verify renews the token when token is in grace period', async () => {
      const { email } = validUserExample

      const response = await axios.get(
        `${apiUrl}/dev/create-grace-token?email=${email}`
      )

      const { token } = response.data

      store.commit('SET_CURRENT_USER', {
        email: validUserExample.email,
        token,
      })

      await store.dispatch('verify')
      expect(store.state.currentUser.token).not.toEqual(token)
    })

    it('actions.logIn rejects with 400 when provided only an email', () => {
      expect.assertions(1)

      return store
        .dispatch('logIn', {
          email: 'email',
        })
        .catch((error) => {
          expect(error.message).toEqual('Request failed with status code 400')
        })
    })

    it('actions.logIn rejects with 400 when provided only a password', () => {
      expect.assertions(1)

      return store
        .dispatch('logIn', {
          password: 'password',
        })
        .catch((error) => {
          expect(error.message).toEqual('Request failed with status code 400')
        })
    })

    it('actions.logIn rejects with 401 when provided an incorrect password', () => {
      expect.assertions(1)

      return store
        .dispatch('logIn', {
          email: validUserExample.email,
          password: 'bad password',
        })
        .catch((error) => {
          expect(error.message).toEqual('Request failed with status code 401')
        })
    })

    it('actions.logIn rejects with 401 when provided an incorrect email and password', () => {
      expect.assertions(1)

      return store
        .dispatch('logIn', {
          email: 'bad email',
          password: 'bad password',
        })
        .catch((error) => {
          expect(error.message).toEqual('Request failed with status code 401')
        })
    })
  })
})

const validUserExample = {
  email: 'director@te.st',
  password: '000000000',
  token: 'valid-token-for-admin',
}

// const expiredToken =
//   'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJ1c2VySWQiOjY2LCJkYXRlQ3JlYXRlZCI6IjIwMjAtMDctMTRUMTA6NDY6MDUuMTkzWiIsImlzc3VlZCI6MTU5NDcyMzU2ODAwMywiZXhwaXJlcyI6MTU5NDcyNDQ2ODAwM30.lCa8JjIdVIkllCq96DB9yYB0hV2jpk6iXei7KCSItogZHdGj-j9gmIOdlx1Hn2P_lnUDP2jf5WMVn_Gc0xwRjw'
