import axios from 'axios'
const apiUrl = process.env.API_BASE_URL
  ? `${process.env.API_BASE_URL}/api`
  : '/api'

export const state = {
  bookingList: [],
  booking: {},
  creatingBookings: false,
  fetchingBookings: false,
  sendingEmailToBookers: [],
  bookingCreationResponse: {},
}

export const getters = {
  bookingCreationResponseIsEmpty(state) {
    return Object.keys(state.bookingCreationResponse).length === 0
  },
}

export const mutations = {
  SET_BOOKING_CREATION_RESPONSE(state, bookingCreationResponse = {}) {
    state.bookingCreationResponse = bookingCreationResponse
  },
  REPLACE_BOOKING_LIST(state, newValue) {
    state.bookingList = [...newValue]
  },
  START_CREATING_BOOKINGS(state) {
    state.creatingBookings = true
    state.bookingCreationResponse = {}
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
  START_SENDING_EMAIL_TO_BOOKER(state, bookerEmail) {
    if (state.sendingEmailToBookers.includes(bookerEmail)) {
      return
    }
    state.sendingEmailToBookers = [...state.sendingEmailToBookers, bookerEmail]
  },
  END_SENDING_EMAIL_TO_BOOKER(state, bookerEmail) {
    state.sendingEmailToBookers = state.sendingEmailToBookers.filter(
      (email) => email !== bookerEmail
    )
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
      const { data: bookingCreationResponse } = await axios.post(
        `${apiUrl}/booking-imports`,
        {
          crossingId,
          data,
          fieldMap,
        }
      )
      commit('SET_BOOKING_CREATION_RESPONSE', bookingCreationResponse)
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
  async sendEmailToBooker(
    { commit, rootGetters, dispatch },
    { bookerEmail, crossingId }
  ) {
    if (!rootGetters['auth/loggedIn']) {
      return null
    }
    commit('START_SENDING_EMAIL_TO_BOOKER', bookerEmail)
    try {
      await axios.post(`${apiUrl}/email/firm-cta`, {
        bookerEmail,
        crossingId,
      })
      await dispatch('fetchBookings', {
        crossingId,
      })
      commit('END_SENDING_EMAIL_TO_BOOKER', bookerEmail)
    } catch (error) {
      console.error(error)
      // 400 -> no new passenger === email already sent for everyone
      // 404 booker does not exist in this crossing
      commit('END_SENDING_EMAIL_TO_BOOKER', bookerEmail)
    }
  },
}
