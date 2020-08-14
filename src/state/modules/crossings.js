import axios from 'axios'
import qs from 'qs'
const apiUrl = process.env.API_BASE_URL
  ? `${process.env.API_BASE_URL}/api`
  : '/api'

export const state = {
  crossingList: [],
  fetchingCrossings: false,
  creatingCrossing: false,
  deletingCrossing: false,
}

export const getters = {}

export const mutations = {
  REPLACE_CROSSING_LIST(state, newValue) {
    state.crossingList = newValue
  },
  START_FETCHING_CROSSINGS(state) {
    state.fetchingCrossings = true
  },
  END_FETCHING_CROSSINGS(state) {
    state.fetchingCrossings = false
  },
  START_CREATING_CROSSING(state) {
    state.creatingCrossing = true
  },
  END_CREATING_CROSSING(state) {
    state.creatingCrossing = false
  },
  START_DELETING_CROSSING(state) {
    state.deletingCrossing = true
  },
  END_DELETING_CROSSING(state) {
    state.deletingCrossing = false
  },
}

export const actions = {
  async fetchCrossings({ commit, getters }, { filters } = {}) {
    if (!getters['auth/loggedIn']) {
      return null
    }

    try {
      commit('START_FETCHING_CROSSINGS')
      const querystring = filters ? qs.stringify(filters) : ''
      const response = await axios.get(`${apiUrl}/crossings?${querystring}`)
      const { data: crossings } = response
      commit('END_FETCHING_CROSSINGS')
      commit('REPLACE_CROSSING_LIST', crossings)
      return crossings
    } catch (error) {
      commit('END_FETCHING_CROSSINGS')
      // console.error(error);
      return null
    }
  },

  async createCrossing({ commit, getters }, crossing) {
    if (!getters['auth/loggedIn']) {
      return null
    }

    try {
      commit('START_CREATING_CROSSING')
      const response = await axios.post(`${apiUrl}/crossings`, crossing)
      commit('END_CREATING_CROSSING')
      return response.data
    } catch (error) {
      commit('END_CREATING_CROSSING')
      // console.error(error);
      return null
    }
  },

  async deleteCrossing({ commit, getters, state }, crossingId) {
    if (!getters['auth/loggedIn']) {
      return null
    }

    try {
      commit('START_DELETING_CROSSING')
      await axios.delete(`${apiUrl}/crossings/${crossingId}`)
      const crossings = state.crossingList.filter(
        (cross) => cross.id !== crossingId
      )
      commit('REPLACE_CROSSING_LIST', crossings)
      commit('END_DELETING_CROSSING')
      return true
    } catch (error) {
      commit('END_DELETING_CROSSING')
      // console.error(error);
      return null
    }
  },
}
