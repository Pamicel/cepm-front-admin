import axios from 'axios'

export const state = {
  crossingList: [],
  fetchingCrossings: false,
  creatingCrossing: false,
  deletingCrossing: false,
  modifyingCrossing: false,
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
  START_MODIFYING_CROSSING(state) {
    state.modifyingCrossing = true
  },
  END_MODIFYING_CROSSING(state) {
    state.modifyingCrossing = false
  },
}

export const actions = {
  async selectCrossing({ commit, state }, crossingId) {
    const crossing =
      state.crossingList.find((cross) => cross.id === crossingId) || null
    commit('SELECT_CROSSING', crossing && crossing.id)
  },

  async fetchCrossings({ commit, rootGetters }) {
    if (!rootGetters['auth/loggedIn']) {
      return null
    }

    try {
      commit('START_FETCHING_CROSSINGS')
      const response = await axios.get(`/api/crossings`)
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

  async createCrossing({ commit, rootGetters }, crossing) {
    if (!rootGetters['auth/loggedIn']) {
      return null
    }

    try {
      commit('START_CREATING_CROSSING')
      const response = await axios.post(`/api/crossings`, crossing)
      commit('END_CREATING_CROSSING')
      return response.data
    } catch (error) {
      commit('END_CREATING_CROSSING')
      // console.error(error);
      return null
    }
  },

  async deleteCrossing({ commit, state, rootGetters }, crossingId) {
    if (!rootGetters['auth/loggedIn']) {
      return null
    }

    try {
      commit('START_DELETING_CROSSING')
      await axios.delete(`/api/crossings/${crossingId}`)
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

  async modifyCrossing({ commit, dispatch, rootGetters }, { id, changes }) {
    if (!rootGetters['auth/loggedIn']) {
      return null
    }

    if (!id || !changes) {
      throw new Error('missing argument')
    }

    if (Object.keys(changes).length === 0) {
      return null
    }

    try {
      commit('START_MODIFYING_CROSSING')
      await axios.patch(`/api/crossings/${id}`, changes)
      await dispatch('fetchCrossings')
      commit('END_MODIFYING_CROSSING')
      return true
    } catch (error) {
      commit('END_MODIFYING_CROSSING')
      // console.error(error);
      return null
    }
  },
}
