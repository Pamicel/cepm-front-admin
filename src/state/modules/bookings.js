import axios from 'axios'
const apiUrl = process.env.API_BASE_URL
  ? `${process.env.API_BASE_URL}/api`
  : '/api'

export const state = {
  bookingList: [],
  booking: {},
  creatingBookings: false,
  fetchingBookings: false,
}

export const getters = {}

export const mutations = {
  REPLACE_BOOKING_LIST(state, newValue) {
    state.bookingList = [...newValue]
  },
  START_CREATING_BOOKINGS(state) {
    state.creatingBookings = true
  },
  END_CREATING_BOOKINGS(state) {
    state.creatingBookings = false
  },
  START_FETCHING_BOOKINGS(state) {
    state.fetchingBookings = true
  },
  END_FETCHING_BOOKINGS(state) {
    state.fetchingBookings = false
  },
}

export const actions = {
  async createBookings(
    { commit, rootGetters },
    { crossingId, data, fieldMap }
  ) {
    if (!rootGetters['auth/loggedIn']) {
      return null
    }
    commit('START_CREATING_BOOKINGS')
    try {
      await axios.post(`${apiUrl}/booking-imports`, {
        crossingId,
        data,
        fieldMap,
      })
      commit('END_CREATING_BOOKINGS')
      return true
    } catch (error) {
      commit('END_CREATING_BOOKINGS')
      console.error(error)
      return null
    }
  },
  async fetchBookings({ commit, rootGetters }, { crossingId }) {
    if (!rootGetters['auth/loggedIn']) {
      return null
    }
    commit('START_FETCHING_BOOKINGS')
    try {
      const response = await axios.get(
        `${apiUrl}/crossings/${crossingId}/bookings`
      )
      const { data: bookings } = response

      commit('REPLACE_BOOKING_LIST', bookings)
      commit('END_FETCHING_BOOKINGS')
      return bookings
    } catch (error) {
      commit('END_FETCHING_BOOKINGS')
      console.error(error)
      return null
    }
  },
}
