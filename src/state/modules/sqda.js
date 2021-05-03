import axios from 'axios'
// import qs from 'qs'
const apiUrl = process.env.API_BASE_URL
  ? `${process.env.API_BASE_URL}/api`
  : '/api'

export const state = {
  questions: [],
  fetchingQuestions: false,
}

export const getters = {}

export const mutations = {
  START_FETCHING_QUESTIONS(state) {
    state.fetchingQuestions = true
  },
  END_FETCHING_QUESTIONS(state) {
    state.fetchingQuestions = false
  },
  REPLACE_QUESTION_LIST(state, questions) {
    state.questions = questions
  },
}

export const actions = {
  async fetchQuestions({ commit, rootGetter }) {
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
}
