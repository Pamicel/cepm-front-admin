import axios from 'axios'
import Vue from 'vue'

const initialState = {
  loading: false,
  current: null,
  list: [],
}

export const state = initialState

export const getters = {
  getCurrent(state) {
    const { current, list } = state
    if (current != null) {
      return list.find((spectator) => spectator.id === current)
    }
  },
  getSpectators(state) {
    return state
  },
}

export const mutations = {
  SET_CURRENT(state, spectatorId) {
    Vue.set(state, 'current', spectatorId)
  },
  UNSET_CURRENT(state) {
    Vue.set(state, 'current', initialState.current)
  },
  SAVE_LIST(state, list) {
    Vue.set(state, 'list', list)
  },
  SAVE_SPECTATOR(state, spectator) {
    // Remove the spectator from the list if it is already there
    const filteredList = state.list.filter(({ id }) => spectator.id === id)

    const newList = [...filteredList, spectator]

    Vue.set(state, 'list', newList)
  },
  START_LOADING(state) {
    Vue.set(state, 'loading', true)
  },
  END_LOADING(state) {
    Vue.set(state, 'loading', false)
  },
}

export const actions = {
  fetchOne({ commit, state }, { spectatorId }) {
    if (state.current !== spectatorId) {
      commit('UNSET_CURRENT')
    }
    commit('START_LOADING')
    return axios
      .get(`/api/spectators/${spectatorId}`)
      .then((response) => {
        const spectator = response.data
        commit('SAVE_SPECTATOR', spectator)
        commit('SET_CURRENT', spectator.id)
        commit('END_LOADING')
        return spectator
      })
      .catch((err) => {
        const { message } = err.response ? err.response.data : {}
        console.error(`${err.message}: ${message}`)
        commit('END_LOADING')
      })
  },
  fetchList({ commit }, { perfId }) {
    commit('START_LOADING')
    const query = perfId ? `?crossing=${perfId}` : ''
    return axios
      .get(`/api/spectators${query}`)
      .then((response) => {
        const list = response.data
        commit('SAVE_LIST', list)
        commit('END_LOADING', false)
        return list
      })
      .catch((err) => {
        const { message } = err.response ? err.response.data : {}
        console.error(`${err.message}: ${message}`)
        commit('END_LOADING', false)
      })
  },
}
