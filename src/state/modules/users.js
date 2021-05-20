import axios from 'axios'
import qs from 'qs'

const apiUrl = process.env.API_BASE_URL
  ? `${process.env.API_BASE_URL}/api`
  : '/api'

const PAGE_SIZE = 100

export const state = {
  cached: [],
  userList: [],
  selectedUser: null,

  fetchingUsers: false,
  fetchingSingleUser: false,
  creatingUser: false,
  deletingUser: false,
  updatingRoles: [],
}

export const getters = {
  isUpdatingUserRole: (state) => (id) => state.updatingRoles.includes(id),
  user: (state) => (userId) => {
    const hadSameId = (id) => (usr) => usr.id === id

    const userInCache = state.cached.find(hadSameId(userId))
    if (userInCache) {
      return {
        ...userInCache,
      }
    }

    const userInList = state.userList.find(hadSameId(userId))
    if (userInList) {
      return {
        ...userInList,
      }
    }

    return null
  },
}

export const mutations = {
  CACHE_USER(state, newUser) {
    const userInCache = state.cached.find((user) => user.id === newUser.id)
    if (!userInCache) {
      state.cached.push(newUser)
    }
  },
  UNCACHE_USER(state, userId) {
    state.cached = state.cached.filter((user) => user.id !== userId)
  },
  SAVE_USERS(state, users) {
    state.userList = [...users]
  },
  UPDATE_USER(state, updatedUser) {
    if (!updatedUser) return

    if (
      state.selectedUser &&
      parseInt(state.selectedUser.id) === parseInt(updatedUser.id)
    ) {
      state.selectedUser = updatedUser
    }

    const replaceUpdatedUser = (oldUser) => {
      const isCorrectUser = parseInt(oldUser.id) === parseInt(updatedUser.id)
      return isCorrectUser ? updatedUser : oldUser
    }
    const cached = state.cached.map(replaceUpdatedUser)
    const userList = state.userList.map(replaceUpdatedUser)
    state.cached = cached
    state.userList = userList
  },
  START_FETCHING_USERS(state) {
    state.fetchingUsers = true
  },
  END_FETCHING_USERS(state) {
    state.fetchingUsers = false
  },
  START_FETCHING_SINGLE_USER(state) {
    state.fetchingSingleUser = true
  },
  END_FETCHING_SINGLE_USER(state) {
    state.fetchingSingleUser = false
  },
  START_CREATING_USER(state) {
    state.creatingUser = true
  },
  END_CREATING_USER(state) {
    state.creatingUser = false
  },
  START_DELETING_USER(state) {
    state.deletingUser = true
  },
  END_DELETING_USER(state) {
    state.deletingUser = false
  },
  START_UPDATING_USER_ROLE(state, userId) {
    state.updatingRoles = [...state.updatingRoles, userId]
  },
  END_UPDATING_USER_ROLE(state, userId) {
    state.updatingRoles = state.updatingRoles.filter((id) => id !== userId)
  },

  SELECT_USER(state, user) {
    state.selectedUser = user && {
      ...user,
    }
  },
}

export const actions = {
  async selectUser({ commit, state }, { userId }) {
    const userMemory = [...state.userList, ...state.cached]
    // Try to find the user in the userList or the cache, default to null
    const user =
      userMemory.find((user) => parseInt(user.id) === parseInt(userId)) || null
    commit('SELECT_USER', user)
  },

  async fetchSingleUser({ commit, state, rootState, rootGetters }, { userId }) {
    if (!rootGetters['auth/loggedIn']) {
      return null
    }

    try {
      commit('START_FETCHING_SINGLE_USER')
      const { data: user } = await axios.get(`${apiUrl}/users/${userId}`)
      commit('END_FETCHING_SINGLE_USER')
      commit('UPDATE_USER', user)
      commit('CACHE_USER', user)
      return user
    } catch (error) {
      // console.error(error)
      commit('END_FETCHING_SINGLE_USER')
      return null
    }
  },

  async fetchUsers({ commit, rootGetters }, { page } = {}) {
    if (!rootGetters['auth/loggedIn']) {
      return null
    }

    const startIndex = page ? (page - 1) * PAGE_SIZE : 0
    const filters = {
      offset: startIndex,
      limit: PAGE_SIZE,
    }
    commit('START_FETCHING_USERS')
    const { data: users } = await axios.get(
      `${apiUrl}/users?${qs.stringify(filters)}`
    )
    commit('END_FETCHING_USERS')
    commit('SAVE_USERS', users)
    return users
  },

  async createUser({ commit, rootGetters }, user) {
    if (!rootGetters['auth/loggedIn']) {
      return null
    }

    try {
      commit('START_CREATING_USER')
      const response = await axios.post(`${apiUrl}/users`, user)
      commit('END_CREATING_USER')
      return response.data
    } catch (error) {
      commit('END_CREATING_USER')
      // console.error(error);
      return null
    }
  },

  async deleteUser({ commit, state, rootGetters }, { userId }) {
    if (!rootGetters['auth/loggedIn']) {
      return null
    }

    try {
      commit('START_DELETING_USER')
      await axios.delete(`${apiUrl}/users/${userId}`)
      const users = state.userList.filter((cross) => cross.id !== userId)
      commit('SAVE_USERS', users)
      commit('UNCACHE_USER', userId)
      commit('END_DELETING_USER')
      return true
    } catch (error) {
      commit('END_DELETING_USER')
      // console.error(error);
      return null
    }
  },

  async updateUserRole(
    { commit, rootGetters, getters },
    { userId, permissionLevel }
  ) {
    if (!rootGetters['auth/loggedIn']) {
      return null
    }

    try {
      commit('START_UPDATING_USER_ROLE', userId)
      await axios.patch(`${apiUrl}/users/${userId}/permission`, {
        permissionLevel,
      })
      commit('END_UPDATING_USER_ROLE', userId)

      // Update the user in the memory
      const user = {
        ...getters.user(userId),
      }
      if (user) {
        const updatedUser = {
          ...user,
          permissionLevel,
        }
        commit('UPDATE_USER', updatedUser)
      }

      return true
    } catch (error) {
      commit('END_UPDATING_USER_ROLE', userId)
      return null
    }
  },
}
