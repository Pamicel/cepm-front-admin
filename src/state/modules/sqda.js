import axios from 'axios'
// import qs from 'qs'
const apiUrl = process.env.API_BASE_URL
  ? `${process.env.API_BASE_URL}/api`
  : '/api'

export const state = {
  questions: [],
  fetchingQuestions: false,
  creatingQuestion: false,
}

export const getters = {}

export const mutations = {
  START_FETCHING_QUESTIONS(state) {
    state.fetchingQuestions = true
  },
  END_FETCHING_QUESTIONS(state) {
    state.fetchingQuestions = false
  },
  START_CREATING_QUESTION(state) {
    state.creatingQuestion = true
  },
  END_CREATING_QUESTION(state) {
    state.creatingQuestion = false
  },
  REPLACE_QUESTION_LIST(state, questions) {
    state.questions = questions
  },
}

export const actions = {
  async fetchQuestions({ commit }) {
    commit('START_FETCHING_QUESTIONS')
    try {
      const response = await axios.get(`${apiUrl}/sqda-questions`)
      const { data: questions } = response
      commit('REPLACE_QUESTION_LIST', questions)
      commit('END_FETCHING_QUESTIONS')
      return questions
    } catch (error) {
      commit('END_FETCHING_QUESTIONS')
      console.error(error)
      return null
    }
  },
  async createQuestion({ commit, rootGetters, dispatch }, { question }) {
    // check logged in
    if (!rootGetters['auth/loggedIn']) {
      return null
    }
    if (question === '') {
      return null
    }
    try {
      commit('START_CREATING_QUESTION')
      // send question
      await axios.post(`${apiUrl}/sqda-questions`, { question })
      commit('END_CREATING_QUESTION')
      // reset question list
      await dispatch('fetchQuestions')
      return true
    } catch (error) {
      // console.error(error)
      commit('END_CREATING_QUESTION')
      // handle conflict
      if (
        error &&
        error.response &&
        (error.response.statusText === 'Conflict' ||
          error.response.status === 409)
      ) {
        return {
          error: {
            statusText: 'Conflict',
            status: 409,
          },
        }
      }

      // handle bad request
      return null
    }
  },
}
