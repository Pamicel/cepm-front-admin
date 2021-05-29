import decodeJWT from 'jwt-decode'
import axios from 'axios'
const apiUrl = process.env.API_BASE_URL
  ? `${process.env.API_BASE_URL}/api`
  : '/api'

export const state = {
  loggingIn: false,
  changingPassword: false,
  deletingAccount: false,
  currentUser: getSavedState('auth.currentUser'),
}

export const mutations = {
  SET_CURRENT_USER(state, newValue) {
    state.currentUser = newValue
    saveState('auth.currentUser', newValue)
    setDefaultAuthHeaders(state)
  },
  START_LOGGING_IN(state) {
    state.loggingIn = true
  },
  END_LOGGING_IN(state) {
    state.loggingIn = false
  },
  START_DELETING_ACCOUNT(state) {
    state.deletingAccount = true
  },
  END_DELETING_ACCOUNT(state) {
    state.deletingAccount = false
  },
  START_CHANGING_PASSWORD(state) {
    state.changingPassword = true
  },
  END_CHANGING_PASSWORD(state) {
    state.changingPassword = false
  },
}

export const PERMISSION_LEVELS = {
  ADMIN: 4,
  DIRECTOR: 3,
  STAFF: 2,
  USER: 1,
}

export const getters = {
  // Whether the user is currently logged in.
  loggedIn(state) {
    return !!state.currentUser
  },
  isAdmin(state) {
    return (
      state.currentUser &&
      state.currentUser.permissionLevel === PERMISSION_LEVELS.ADMIN
    )
  },
  isDirector(state) {
    return (
      state.currentUser &&
      state.currentUser.permissionLevel === PERMISSION_LEVELS.DIRECTOR
    )
  },
  isStaff(state) {
    return (
      state.currentUser &&
      state.currentUser.permissionLevel >= PERMISSION_LEVELS.STAFF
    )
  },
}

export const actions = {
  // This is automatically run in `src/state/store.js` when the app
  // starts, along with any other actions named `init` in other modules.
  init({ state, dispatch }) {
    setDefaultAuthHeaders(state)
    dispatch('verify')
  },

  // Logs in the current user.
  async logIn({ commit }, { email, password } = {}) {
    commit('START_LOGGING_IN')
    try {
      const response = await axios.post(`${apiUrl}/auth/login`, {
        email,
        password,
      })

      const token = response.data.token
      const user = {
        ...decodeJWT(token),
        token,
      }
      commit('SET_CURRENT_USER', user)
      commit('END_LOGGING_IN')
      return user
    } catch (error) {
      commit('END_LOGGING_IN')
      throw error
    }
  },

  // Logs out the current user.
  logOut({ commit }) {
    commit('SET_CURRENT_USER', null)
  },

  // Validates the current user's token and refreshes it
  // with new data from the API.
  async verify({ commit, state, dispatch }) {
    if (!state.currentUser || !state.currentUser.token) {
      await dispatch('logOut')
      return null
    }

    try {
      const response = await axios.get(`${apiUrl}/auth/verify`) // Auth header is implicit

      const token = response.data.token

      const user = {
        ...decodeJWT(token),
        token,
      }

      commit('SET_CURRENT_USER', user)
      return user
    } catch (error) {
      if (error.response && error.response.status !== 401) {
        console.warn(error)
      }
      await dispatch('logOut')
      return null
    }
  },

  async changePassword(
    { state, commit },
    { userId, oldPassword, newPassword }
  ) {
    if (!state.currentUser || !state.currentUser.token) {
      return null
    }

    try {
      commit('START_CHANGING_PASSWORD')
      await axios.patch(`${apiUrl}/users/${userId}/password`, {
        newPassword,
        oldPassword,
      })
      commit('END_CHANGING_PASSWORD')
      return true
    } catch (error) {
      commit('END_CHANGING_PASSWORD')
      console.warn(error)
      return null
    }
  },

  async deleteAccount({ state, commit, dispatch }, { password }) {
    if (!state.currentUser || !state.currentUser.token) {
      return null
    }

    try {
      commit('START_DELETING_ACCOUNT')
      await axios.post(`${apiUrl}/delete-account`, {
        password,
      })
      commit('END_DELETING_ACCOUNT')
      dispatch('logOut')
      return true
    } catch (error) {
      console.warn(error)
      commit('END_DELETING_ACCOUNT')
      return null
    }
  },
}

// ===
// Private helpers
// ===

function getSavedState(key) {
  return JSON.parse(window.localStorage.getItem(key))
}

function saveState(key, state) {
  window.localStorage.setItem(key, JSON.stringify(state))
}

function setDefaultAuthHeaders(state) {
  axios.defaults.headers.common.Authorization = state.currentUser
    ? `Bearer ${state.currentUser.token}`
    : ''
}
