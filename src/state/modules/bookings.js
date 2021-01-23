import axios from 'axios'
import qs from 'qs'
const apiUrl = process.env.API_BASE_URL
  ? `${process.env.API_BASE_URL}/api`
  : '/api'

export const state = {
  bookingList: [],
  booking: {},
  creatingBookings: false,
  fetchingBookings: false,
  modifyingBooking: false,
  sendingEmailToBookers: [],
  bookingsBeingRefreshed: [],
  bookingsBeingDeleted: [],
  bookingCreationResponse: {},
}

export const getters = {
  bookingCreationResponseIsEmpty(state) {
    return Object.keys(state.bookingCreationResponse).length === 0
  },
  deletingBooking(state) {
    return state.bookingsBeingDeleted.length !== 0
  },
  refreshingBooking(state) {
    return state.bookingsBeingRefreshed.length !== 0
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
  START_MODIFYING_BOOKING(state) {
    state.modifyingBooking = true
  },
  END_MODIFYING_BOOKING(state) {
    state.modifyingBooking = false
  },

  REFRESH_BOOKING(state, booking) {
    const index = state.bookingList.findIndex((b) => b.id === booking.id)
    if (index !== -1) {
      state.bookingList[index] = { ...booking }
    }
  },

  START_DELETING_BOOKING(state, bookingId) {
    if (state.bookingsBeingDeleted.includes(bookingId)) {
      return
    }
    state.bookingsBeingDeleted = [...state.bookingsBeingDeleted, bookingId]
  },
  END_DELETING_BOOKING(state, bookingId) {
    state.bookingsBeingDeleted = [
      ...state.bookingsBeingDeleted.filter((id) => id !== bookingId),
    ]
  },

  START_REFRESHING_BOOKING(state, bookingId) {
    if (state.bookingsBeingRefreshed.includes(bookingId)) {
      return
    }
    state.bookingsBeingRefreshed = [...state.bookingsBeingRefreshed, bookingId]
  },
  END_REFRESHING_BOOKING(state, bookingId) {
    state.bookingsBeingRefreshed = [
      ...state.bookingsBeingRefreshed.filter((id) => id !== bookingId),
    ]
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
      const query = qs.stringify({
        filter: {
          where: { crossingId: parseInt(crossingId) },
          include: [{ relation: 'users' }],
        },
      })
      const response = await axios.get(`${apiUrl}/bookings?${query}`)
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
  async refreshBooking({ commit, rootGetters }, { bookingId }) {
    if (!rootGetters['auth/loggedIn']) {
      return null
    }
    commit('START_REFRESHING_BOOKING', bookingId)
    try {
      const query = qs.stringify({
        filter: {
          include: [{ relation: 'users' }],
        },
      })
      const response = await axios.get(
        `${apiUrl}/bookings/${bookingId}?${query}`
      )
      const { data: booking } = response

      commit('REFRESH_BOOKING', booking)
      commit('END_REFRESHING_BOOKING', bookingId)
      return booking
    } catch (error) {
      commit('END_REFRESHING_BOOKING', bookingId)
      console.error(error)
      return null
    }
  },
  async modifyBooking(
    { commit, rootGetters, dispatch },
    { crossingId, bookingId, modifs }
  ) {
    if (!rootGetters['auth/loggedIn']) {
      return null
    }
    commit('START_MODIFYING_BOOKING')
    try {
      await axios.patch(`${apiUrl}/bookings/${bookingId}`, modifs)

      commit('END_MODIFYING_BOOKING')
      return dispatch('fetchBookings', { crossingId: crossingId })
    } catch (error) {
      commit('END_MODIFYING_BOOKING')
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
  async deleteBooking(
    { commit, rootGetters, dispatch },
    { bookingId, crossingId }
  ) {
    if (!rootGetters['auth/loggedIn']) {
      return null
    }
    commit('START_DELETING_BOOKING', bookingId)
    try {
      await axios.delete(`${apiUrl}/bookings/${bookingId}`, {
        bookingId,
      })
      await dispatch('fetchBookings', {
        crossingId,
      })
      commit('END_DELETING_BOOKING', bookingId)
    } catch (error) {
      console.error(error)
      commit('END_DELETING_BOOKING', bookingId)
    }
  },
}
