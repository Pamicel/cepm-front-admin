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
      return list.find((perf) => perf.id === current)
    }
  },
}

export const mutations = {
  SET_CURRENT(state, perfId) {
    Vue.set(state, 'current', perfId)
  },
  SAVE_LIST(state, list) {
    Vue.set(state, 'list', list)
  },
  SAVE_PERFORMANCE(state, performance) {
    // Remove the performance from the list if it is already there
    const filteredList = state.list.filter(({ id }) => performance.id === id)

    const newList = [...filteredList, performance]

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
  fetchPerf({ commit }, { perfId }) {
    commit('START_LOADING')
    return axios
      .get(`/api/performances/${perfId}`)
      .then((response) => {
        const perf = response.data
        commit('SAVE_PERFORMANCE', perf)
        commit('SET_CURRENT', perf.id)
        commit('END_LOADING')
        return perf
      })
      .catch((err) => {
        const { message } = err.response ? err.response.data : {}
        console.error(`${err.message}: ${message}`)
        commit('END_LOADING')
      })
  },
  fetchPerfList({ commit }) {
    commit('START_LOADING')
    return axios
      .get(`/api/performances`)
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
