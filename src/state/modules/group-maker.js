// import axios from 'axios'
import { changeGroup, createGroups, parseDeaths } from './group-maker.helpers'

export const state = {
  groups: {},
  crossingId: null,
}

export const getters = {}

export const mutations = {
  SAVE_GROUPS(state, { crossingId, groups }) {
    state.groups = groups
    state.crossingId = crossingId
  },
  START_SENDING_GROUPS(state) {
    state.sendingGroups = true
  },
  END_SENDING_GROUPS(state) {
    state.sendingGroups = false
  },
}

export const actions = {
  async createGroups({ commit }, { crossingId, deaths }) {
    const profiles = parseDeaths(deaths)
    const groups = createGroups(profiles)
    commit('SAVE_GROUPS', { crossingId, groups })
    return groups
  },
  async changeGroup({ state, commit }, { profile, oldId, newId }) {
    commit('SAVE_GROUPS', {
      crossingId: state.crossingId,
      groups: changeGroup({ groups: state.groups, profile, newId, oldId }),
    })
  },
  async sendGroup({ commit, state, rootGetters }, { crossingId }) {
    if (crossingId !== state.crossingId) {
      return null
    }
    if (!rootGetters['auth/loggedIn']) {
      return null
    }
    try {
      commit('START_SENDING_GROUPS')
      // const payload = {
      //   crossingId,
      //   groups: Object.values(state.groups).map((gp) => {
      //     return {
      //       id: gp.id,
      //       deathIds: gp.profiles.map((p) => p.id),
      //     }
      //   }),
      // }

      // const { data } = await axios.post(`/api/death/`, payload)

      // console.log(data)
      // commit("SAVE_GROUPS", data);

      // send
      commit('END_SENDING_GROUPS')
    } catch (error) {
      commit('END_SENDING_GROUPS')
    }
  },
}
