import axios from 'axios'

export const state = {
  deathList: [],
  fetchingDeaths: false,

  deathSimulationList: [],
  fetchingDeathSimulations: false,

  changingDeathOwner: [],

  creatingDeath: false,

  sendingDeathForm: [],
  selectingDeathActivity: [],
}

export const getters = {}

export const mutations = {
  REPLACE_DEATH_LIST(state, deaths) {
    state.deathList = [...deaths]
  },
  UPDATE_DEATH_IN_LIST(state, death) {
    if (state.deathList.find((d) => d.id === death.id)) {
      state.deathList = [
        ...state.deathList.filter((d) => d.id !== death.id),
        death,
      ]
    }
  },

  START_FETCHING_DEATHS(state) {
    state.fetchingDeaths = true
  },
  END_FETCHING_DEATHS(state) {
    state.fetchingDeaths = false
  },

  REPLACE_DEATH_SIMULATION_LIST(state, deaths) {
    state.deathSimulationList = [...deaths]
  },
  START_FETCHING_DEATH_SIMULATIONS(state) {
    state.fetchingDeathSimulations = true
  },
  END_FETCHING_DEATH_SIMULATIONS(state) {
    state.fetchingDeathSimulations = false
  },

  START_CHANGING_DEATH_OWNER(state, deathId) {
    state.changingDeathOwner = [
      ...state.changingDeathOwner.filter((id) => id !== deathId),
      deathId,
    ]
  },
  END_CHANGING_DEATH_OWNER(state, deathId) {
    state.changingDeathOwner = [
      ...state.changingDeathOwner.filter((id) => id !== deathId),
    ]
  },

  START_CREATING_DEATH(state) {
    state.creatingDeath = true
  },
  END_CREATING_DEATH(state) {
    state.creatingDeath = false
  },

  START_SENDING_DFORM(state, deathId) {
    state.sendingDeathForm = [...state.sendingDeathForm, deathId]
  },
  END_SENDING_DFORM(state, deathId) {
    state.sendingDeathForm = [
      ...state.sendingDeathForm.filter((id) => id !== deathId),
    ]
  },

  START_SELECTING_ACTIVITY(state, deathId) {
    state.selectingDeathActivity = [...state.selectingDeathActivity, deathId]
  },
  END_SELECTING_ACTIVITY(state, deathId) {
    state.selectingDeathActivity = [
      ...state.selectingDeathActivity.filter((id) => id !== deathId),
    ]
  },
}

export const actions = {
  async fetchDeaths({ commit, rootGetters }, { crossingId }) {
    if (!rootGetters['auth/loggedIn']) {
      return null
    }
    commit('START_FETCHING_DEATHS')
    try {
      const response = await axios.get(`/api/death?crossing=${crossingId}`)
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
  async fetchDeathSimulations({ commit, rootGetters }) {
    if (!rootGetters['auth/loggedIn']) {
      return null
    }
    commit('START_FETCHING_DEATH_SIMULATIONS')
    try {
      const response = await axios.get(`/api/death/simulations`)
      const { data: deaths } = response
      commit('REPLACE_DEATH_SIMULATION_LIST', deaths)
      commit('END_FETCHING_DEATH_SIMULATIONS')
      return deaths
    } catch (error) {
      console.error(error)
      commit('END_FETCHING_DEATH_SIMULATIONS')
      return null
    }
  },
  async changeDeathOwner({ commit, rootGetters }, { deathId, userId }) {
    if (!rootGetters['auth/loggedIn']) {
      return null
    }
    commit('START_CHANGING_DEATH_OWNER', deathId)
    try {
      const response = await axios.patch(`/api/death/${deathId}/change-owner`, {
        newOwnerId: userId,
      })
      const { data: death } = response
      commit('UPDATE_DEATH_IN_LIST', death)
      commit('END_CHANGING_DEATH_OWNER', deathId)
      return death
    } catch (error) {
      console.error(error)
      commit('END_CHANGING_DEATH_OWNER', deathId)
      return null
    }
  },
  async createDeath({ commit, rootGetters, dispatch }, { crossingId }) {
    if (!rootGetters['auth/loggedIn']) {
      return null
    }
    commit('START_CREATING_DEATH')
    try {
      const response = await axios.post(`/api/death`, { crossingId })
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

  async sendDeathForm({ rootGetters, commit }, { form, deathId }) {
    if (!rootGetters['auth/loggedIn']) {
      return null
    }
    commit('START_SENDING_DFORM', deathId)
    try {
      // Send new form for active death
      await axios.post(`/api/death/${deathId}/form`, {
        ...form,
      })
      commit('END_SENDING_DFORM', deathId)
      return true
    } catch (error) {
      console.error(error)
      commit('END_SENDING_DFORM')
      return null
    }
  },

  async selectActivity(
    { rootGetters, commit },
    { deathId, selection = [], deselect = false }
  ) {
    if (!rootGetters['auth/loggedIn']) {
      return null
    }
    commit('START_SELECTING_ACTIVITY', deathId)
    try {
      const url = `/api/death/${deathId}/select-for${
        deselect ? '?deselect=true' : ''
      }`
      const payload = { selectedFor: selection }
      const response = await axios.patch(url, payload)
      const { data: death } = response
      commit('UPDATE_DEATH_IN_LIST', death)
      commit('END_SELECTING_ACTIVITY', deathId)
      return true
    } catch (error) {
      console.error(error)
      commit('END_SELECTING_ACTIVITY', deathId)
      return null
    }
  },
}
