import axios from 'axios'
import qs from 'qs'
const apiUrl = process.env.API_BASE_URL
  ? `${process.env.API_BASE_URL}/api`
  : '/api'

export const state = {
  firms: [],
  firmsPage: 0,
  firmsPerPage: 50,
  fetchingFirms: false,
  fetchingFirmsDetails: [],
}

export const getters = {}

export const mutations = {
  SAVE_FIRMS(state, newValue = []) {
    state.firms = [...newValue]
  },
  RESET_FIRMS(state) {
    state.firms = []
  },
  SET_FIRMS_PAGE(state, page = 0) {
    state.firmsPage = page
  },
  SAVE_FIRM_DETAILS(state, detailedFirm) {
    const firmIndex = state.firms.findIndex(
      (firm) => firm.id === detailedFirm.id
    )

    if (firmIndex !== -1) {
      state.firms[firmIndex] = { ...detailedFirm }
    } else {
      state.firms = [...state.firms, { ...detailedFirm }]
    }
  },
  START_FETCHING_FIRMS(state) {
    state.fetchingFirms = true
  },
  END_FETCHING_FIRMS(state) {
    state.fetchingFirms = false
  },

  START_FETCHING_FIRM_DETAILS(state, firmId) {
    if (state.fetchingFirmsDetails.includes(firmId)) {
      return
    }
    state.fetchingFirmsDetails = [...state.fetchingFirmsDetails, firmId]
  },
  END_FETCHING_FIRM_DETAILS(state, firmId) {
    state.fetchingFirmsDetails = state.fetchingFirmsDetails.filter(
      (id) => id !== firmId
    )
  },
}

export const actions = {
  async fetchFirms({ rootGetters, state, commit }, { page }) {
    if (!rootGetters['auth/loggedIn']) {
      return null
    }

    const filters = {
      offset: page * state.firmsPerPage,
      limit: state.firmsPerPage,
      fields: {
        id: true,
        firstname: true,
        lastname: true,
        // none of the others
        gender: false,
        birthDate: false,
        birthPlace: false,
        afterLife: false,
        grievances: false,
        grievancesDetails: false,
        job: false,
        pet: false,
        petDetails: false,
        importantPeopleRoles: false,
        importantPeopleNames: false,
        crossingType: false,
        intimate: false,
        public: false,
        captcha: false,
        song: false,
        dream: false,
        dreamDetails: false,
        enemy: false,
        enemyDetails: false,
        remorse: false,
        remorseDetails: false,
        imageRights: false,
        userId: false,
      },
    }
    const querystring = filters ? qs.stringify(filters) : ''

    try {
      commit('START_FETCHING_FIRMS')
      const { data } = await axios.get(`${apiUrl}/form-firms?${querystring}`)
      commit('SAVE_FIRMS', data)
      commit('SAVE_FIRMS_PAGE', page)
      commit('END_FETCHING_FIRMS')
      return data
    } catch (error) {
      commit('END_FETCHING_FIRMS')
      console.error(error)
      return null
    }
  },
  async fetchFirmDetails({ rootGetters, commit }, { id }) {
    if (!rootGetters['auth/loggedIn']) {
      return null
    }
    try {
      commit('START_FETCHING_FIRM_DETAILS', id)
      const { data } = await axios.get(`${apiUrl}/form-firms/${id}`)
      commit('SAVE_FIRM_DETAILS', data)
      commit('END_FETCHING_FIRM_DETAILS', id)
      return data
    } catch (error) {
      commit('END_FETCHING_FIRM_DETAILS', id)
      console.error(error)
      return null
    }
  },
}
