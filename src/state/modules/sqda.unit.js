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

  it('mutation sqda/REPLACE_QUESTION_LIST sets questions to the given value', () => {
    const newQuestionList = ['a', 'b', 'c']
    expect(store.state.sqda.questions).not.toEqual(newQuestionList)
    store.commit('sqda/REPLACE_QUESTION_LIST', newQuestionList)
    expect(store.state.sqda.questions).toEqual(newQuestionList)
  })

  it('mutation sqda/START_CREATING_QUESTION sets creatingQuestion to true', () => {
    expect(store.state.sqda.creatingQuestion).toBe(false)
    store.commit('sqda/START_CREATING_QUESTION')
    expect(store.state.sqda.creatingQuestion).toBe(true)
  })

  it('mutation sqda/END_CREATING_QUESTION sets creatingQuestion to false', () => {
    store.commit('sqda/START_CREATING_QUESTION')
    expect(store.state.sqda.creatingQuestion).toBe(true)
    store.commit('sqda/END_CREATING_QUESTION')
    expect(store.state.sqda.creatingQuestion).toBe(false)
  })

  it('action sqda/fetchQuestions resolves to the list of questions', async () => {
    const questions = await store.dispatch('sqda/fetchQuestions')
    expect(questions instanceof Array).toBe(true)
  })

  it('action sqda/createQuestion resolves to null with empty question', async () => {
    await logInAsDirector(store)
    const question = ''
    const questionsBefore = [...store.state.sqda.questions]
    expect(await store.dispatch('sqda/createQuestion', { question })).toBeNull()
    expect(await store.state.sqda.questions).toEqual(questionsBefore)
  })

  const questionA = 'questionA'
  const questionB = 'questionB'
  const questionC = 'questionC'
  it('action sqda/createQuestion resolves to true with correct question', async () => {
    await logInAsDirector(store)
    const question = questionA
    expect(await store.dispatch('sqda/createQuestion', { question })).toBe(true)
  })

  it('action sqda/createQuestion updates the question list after success', async () => {
    await logInAsDirector(store)
    const question = questionB
    const questionsBefore = [...store.state.sqda.questions]
    expect(await store.dispatch('sqda/createQuestion', { question })).toBe(true)
    expect(await store.state.sqda.questions).not.toEqual(questionsBefore)
  })

  it('action sqda/createQuestion resolves to error description on conflict', async () => {
    await logInAsDirector(store)
    const question = questionC
    expect(await store.dispatch('sqda/createQuestion', { question })).toBe(true)
    expect(
      (await store.dispatch('sqda/createQuestion', { question })).error.status
    ).toEqual(409)
  })
})

const directorUser = {
  email: 'director@te.st',
  password: '000000000',
}

async function logInAsDirector(store) {
  const { email, password } = directorUser
  return await store.dispatch('auth/logIn', {
    email,
    password,
  })
}
