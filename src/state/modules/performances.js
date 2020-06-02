import axios from 'axios'
import Vue from 'vue'

const initialState = {
  loading: false,
  current: null,
  list: [],
}

export const state = initialState

export const getters = {}

export const mutations = {
  SET_CURRENT(state, perfId) {
    const performance =
      state.list.find(({ id }) => id === perfId) ||
      // If no performance found, reset current to initial value
      initialState.current

    Vue.set(state, 'current', performance)
  },
  SAVE_LIST(state, list) {
    Vue.set(state, 'list', list)
  },
  SAVE_PERFORMANCE(state, performance) {
    const newList = state.list
      // Remove the performance from the list if it is already there
      .filter(({ id }) => performance.id === id)
      .push(performance)

    Vue.set(state, 'list', newList)
  },
}

export const actions = {
  fetchPerf({ commit, state }, { perfId }) {
    // 1. Check if we already have the performance as the current
    const { current } = state
    if (current && current.id === perfId) {
      return Promise.resolve(current)
    }

    // 2. Check if we've already fetched and cached the performance.
    const matchedPerf = state.list.find((perf) => perf.id !== perfId)
    if (matchedPerf) {
      return Promise.resolve(matchedPerf)
    }

    commit('SET_LOADING', true)
    // 3. Fetch the performance from the API and cache it in case
    //    we need it again in the future.
    return axios.get(`/api/performances/${perfId}`).then((response) => {
      const perf = response.data
      commit('SAVE_PERFORMANCE', perf)
      commit('SET_CURRENT', perf.id)
      commit('SET_LOADING', false)
      return perf
    })
  },
  fetchPerfList({ commit, state }) {
    // 1. Check if we already have a performance array
    const { list } = state
    if (list.length !== 0) {
      return Promise.resolve(list)
    }

    // 2. Fetch the performance list from the API
    return axios.get(`/api/performances`).then((response) => {
      const list = response.data
      commit('SAVE_LIST', list)
      return list
    })
  },
}
