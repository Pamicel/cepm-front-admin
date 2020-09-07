import axios from 'axios'
const apiUrl = process.env.API_BASE_URL
  ? `${process.env.API_BASE_URL}/api`
  : '/api'

export const state = {
  passengerList: [],
  passenger: {},
  creatingPassengers: false,
  fetchingPassengers: false,
}

export const getters = {}

export const mutations = {
  REPLACE_PASSENGER_LIST(state, newValue) {
    state.passengerList = [...newValue]
  },
  START_CREATING_PASSENGERS(state) {
    state.creatingPassengers = true
  },
  END_CREATING_PASSENGERS(state) {
    state.creatingPassengers = false
  },
  START_FETCHING_PASSENGERS(state) {
    state.fetchingPassengers = true
  },
  END_FETCHING_PASSENGERS(state) {
    state.fetchingPassengers = false
  },
}

export const actions = {
  async createPassengers(
    { commit, rootGetters },
    { crossingId, data, fieldMap }
  ) {
    if (!rootGetters['auth/loggedIn']) {
      return null
    }
    commit('START_CREATING_PASSENGERS')
    try {
      await axios.post(`${apiUrl}/booking-imports`, {
        crossingId,
        data,
        fieldMap,
      })
      commit('END_CREATING_PASSENGERS')
      return true
    } catch (error) {
      commit('END_CREATING_PASSENGERS')
      console.error(error)
      return null
    }
  },
  async fetchPassengers({ commit, rootGetters }, { crossingId }) {
    if (!rootGetters['auth/loggedIn']) {
      return null
    }
    commit('START_FETCHING_PASSENGERS')
    try {
      const response = await axios.get(
        `${apiUrl}/crossings/${crossingId}/bookings`
      )
      const { data: passengers } = response

      commit('REPLACE_PASSENGER_LIST', passengers)
      commit('END_FETCHING_PASSENGERS')
      return passengers
    } catch (error) {
      commit('END_FETCHING_PASSENGERS')
      console.error(error)
      return null
    }
  },
}
