import * as sqdaModule from './sqda'
import * as authModule from './auth'

describe('@state/modules/sqda', () => {
  let store
  beforeEach(async () => {
    store = createModuleStore({
      auth: authModule,
      sqda: sqdaModule,
    })
    window.localStorage.clear()
  })

  it('exports a valid Vuex module', () => {
    expect(sqdaModule).toBeAVuexModule()
  })

  it('mutation sqda/START_FETCHING_QUESTIONS sets fetchingQuestions to true', () => {
    expect(store.state.sqda.fetchingQuestions).toBe(false)
    store.commit('sqda/START_FETCHING_QUESTIONS')
    expect(store.state.sqda.fetchingQuestions).toBe(true)
  })

  it('mutation sqda/END_FETCHING_QUESTIONS sets fetchingQuestions to false', () => {
    store.commit('sqda/START_FETCHING_QUESTIONS')
    expect(store.state.sqda.fetchingQuestions).toBe(true)
    store.commit('sqda/END_FETCHING_QUESTIONS')
    expect(store.state.sqda.fetchingQuestions).toBe(false)
  })

  it('mutation sqda/REPLACE_QUESTION_LIST to set questions to the given value', () => {
    const newQuestionList = ['a', 'b', 'c']
    expect(store.state.sqda.questions).not.toEqual(newQuestionList)
    store.commit('sqda/REPLACE_QUESTION_LIST', newQuestionList)
    expect(store.state.sqda.questions).toEqual(newQuestionList)
  })

  it('action sqda/fetchQuestions resolves to the list of questions', async () => {
    const questions = await store.dispatch('sqda/fetchQuestions')
    expect(questions instanceof Array).toBe(true)
  })
})

// const directorUser = {
//   email: 'director@te.st',
//   password: '000000000',
// }

// async function logInAsDirector(store) {
//   const { email, password } = directorUser
//   return await store.dispatch('auth/logIn', {
//     email,
//     password,
//   })
// }
