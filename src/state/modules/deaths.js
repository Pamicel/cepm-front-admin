import axios from 'axios'
const apiUrl = process.env.API_BASE_URL ? `${process.env.API_BASE_URL}` : '/api'

export const state = {
  deathList: [],
  fetchingDeaths: false,
  creatingDeath: false,
}

export const getters = {}

export const mutations = {
  REPLACE_DEATH_LIST(state, deaths) {
    state.deathList = [...deaths]
  },
  START_FETCHING_DEATHS(state) {
    state.fetchingDeaths = true
  },
  END_FETCHING_DEATHS(state) {
    state.fetchingDeaths = false
  },
  START_CREATING_DEATH(state) {
    state.creatingDeath = true
  },
  END_CREATING_DEATH(state) {
    state.creatingDeath = false
  },
}

export const actions = {
  async fetchDeaths({ commit, rootGetters }, { crossingId }) {
    if (!rootGetters['auth/loggedIn']) {
      return null
    }
    commit('START_FETCHING_DEATHS')
    try {
      const response = await axios.get(`${apiUrl}/death?crossing=${crossingId}`)
      const { data: deaths } = response
      commit('REPLACE_DEATH_LIST', deaths)
      commit('END_FETCHING_DEATHS')
      return deaths
    } catch (error) {
      console.error(error)
      commit('END_FETCHING_DEATHS')
      return null
    }
  },
  async createDeath({ commit, rootGetters, dispatch }, { crossingId }) {
    if (!rootGetters['auth/loggedIn']) {
      return null
    }
    commit('START_CREATING_DEATH')
    try {
      const response = await axios.post(`${apiUrl}/death`, { crossingId })
      const { data: death } = response
      commit('END_CREATING_DEATH')
      dispatch('fetchDeaths', { crossingId })
      return death
    } catch (error) {
      console.error(error)
      commit('END_CREATING_DEATH')
      return null
    }
  },
}
