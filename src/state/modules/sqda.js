import axios from 'axios'
// import qs from 'qs'
const apiUrl = process.env.API_BASE_URL
  ? `${process.env.API_BASE_URL}/api`
  : '/api'

export const state = {
  questions: [],
  fetchingQuestions: false,
  creatingQuestion: false,
  questionsBeingModified: new Set(),
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
  START_MODIFYING_QUESTION(state, id) {
    const currentSet = state.questionsBeingModified
    currentSet.add(id)
    state.questionsBeingModified = new Set([...currentSet])
  },
  END_MODIFYING_QUESTION(state, id) {
    const currentSet = state.questionsBeingModified
    currentSet.delete(id)
    state.questionsBeingModified = new Set([...currentSet])
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
      const { data } = await axios.post(`${apiUrl}/sqda-questions`, {
        question,
      })
      commit('END_CREATING_QUESTION')
      // reset question list
      await dispatch('fetchQuestions')
      return data.id
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
  async changeQuestionVisibility(
    { commit, rootGetters, dispatch, state },
    { id, hide }
  ) {
    // check logged in
    if (!rootGetters['auth/loggedIn']) {
      return null
    }
    if (state.questionsBeingModified.has(id)) {
      return null
    }

    try {
      commit('START_MODIFYING_QUESTION', id)
      // send question
      const { data } = await axios.patch(`${apiUrl}/sqda-questions/${id}`, {
        hide,
      })
      commit('END_MODIFYING_QUESTION', id)
      // reset question list
      await dispatch('fetchQuestions')
      return data.id
    } catch (error) {
      commit('END_MODIFYING_QUESTION', id)

      // handle bad request
      return null
    }
  },
}