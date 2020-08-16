import * as crossingsModule from './crossings'
import * as authModule from './auth'

describe('@state/modules/crossings', () => {
  let store
  beforeEach(async () => {
    store = createModuleStore({
      crossings: crossingsModule,
      auth: authModule,
    })
    // store = createModuleStore(crossingsModule)
    window.localStorage.clear()
  })

  it('exports a valid Vuex module', () => {
    expect(crossingsModule).toBeAVuexModule()
  })

  it('crossingList starts empty', () => {
    expect(store.state.crossings.crossingList).toEqual([])
  })

  it('fetchingCrossings starts false', () => {
    expect(store.state.crossings.fetchingCrossings).toEqual(false)
  })

  it('mutations.REPLACE_CROSSING_LIST replaces the current crossing list with a new one', () => {
    store.commit('crossings/REPLACE_CROSSING_LIST', [...validCrossings])

    expect(store.state.crossings.crossingList).toEqual([...validCrossings])
  })

  it('mutations.START_FETCHING_CROSSINGS sets fetchingCrossings to true', () => {
    store.commit('crossings/START_FETCHING_CROSSINGS')

    expect(store.state.crossings.fetchingCrossings).toEqual(true)
  })

  it('mutations.END_FETCHING_CROSSINGS sets fetchingCrossings to false', () => {
    store.commit('crossings/START_FETCHING_CROSSINGS')
    expect(store.state.crossings.fetchingCrossings).toEqual(true)
    store.commit('crossings/END_FETCHING_CROSSINGS')
    expect(store.state.crossings.fetchingCrossings).toEqual(false)
  })

  it('creatingCrossing starts false', () => {
    expect(store.state.crossings.creatingCrossing).toEqual(false)
  })

  it('mutations.START_CREATING_CROSSING sets creatingCrossing to true', () => {
    store.commit('crossings/START_CREATING_CROSSING')

    expect(store.state.crossings.creatingCrossing).toEqual(true)
  })

  it('mutations.END_CREATING_CROSSING sets creatingCrossing to false', () => {
    store.commit('crossings/START_CREATING_CROSSING')
    expect(store.state.crossings.creatingCrossing).toEqual(true)
    store.commit('crossings/END_CREATING_CROSSING')
    expect(store.state.crossings.creatingCrossing).toEqual(false)
  })

  it('deletingCrossing starts false', () => {
    expect(store.state.crossings.deletingCrossing).toEqual(false)
  })

  it('mutations.START_DELETING_CROSSING sets creatingCrossing to true', () => {
    store.commit('crossings/START_DELETING_CROSSING')

    expect(store.state.crossings.deletingCrossing).toEqual(true)
  })

  it('mutations.END_DELETING_CROSSING sets deletingCrossing to false', () => {
    store.commit('crossings/START_DELETING_CROSSING')
    expect(store.state.crossings.deletingCrossing).toEqual(true)
    store.commit('crossings/END_DELETING_CROSSING')
    expect(store.state.crossings.deletingCrossing).toEqual(false)
  })

  it('modifyingCrossing starts false', () => {
    expect(store.state.crossings.modifyingCrossing).toEqual(false)
  })

  it('mutations.START_MODIFYING_CROSSING sets modifyingCrossing to true', () => {
    store.commit('crossings/START_MODIFYING_CROSSING')

    expect(store.state.crossings.modifyingCrossing).toEqual(true)
  })

  it('mutations.END_MODIFYING_CROSSING sets modifyingCrossing to false', () => {
    store.commit('crossings/START_MODIFYING_CROSSING')
    expect(store.state.crossings.modifyingCrossing).toEqual(true)
    store.commit('crossings/END_MODIFYING_CROSSING')
    expect(store.state.crossings.modifyingCrossing).toEqual(false)
  })

  it('actions.fetchCrossings resolves to null when not logged in', async () => {
    const crossings = await store.dispatch('crossings/fetchCrossings')
    expect(crossings).toEqual(null)
  })

  it('actions.fetchCrossings resolves to null when not logged in', async () => {
    const crossings = await store.dispatch('crossings/fetchCrossings')
    expect(crossings).toEqual(null)
  })

  it('actions.fetchCrossings resolves to a list when user logged in as director', async () => {
    await logInAsDirector(store)
    const crossings = await store.dispatch('crossings/fetchCrossings')
    expect(crossings instanceof Array).toBe(true)
  })

  it('actions.fetchCrossings updates crossingList when user logged in as director', async () => {
    await logInAsDirector(store)
    const crossings = await store.dispatch('crossings/fetchCrossings')
    const sortedCrossings = [...crossings].sort((a, b) => a.id < b.id)
    const sortedStoreCrossings = [...store.state.crossings.crossingList].sort(
      (a, b) => a.id < b.id
    )

    expect(sortedCrossings).toEqual(sortedStoreCrossings)
  })

  it('actions.createCrossing resolves to null when user not logged in', async () => {
    const response = await store.dispatch(
      'crossings/createCrossing',
      validCrossing
    )
    expect(response).toEqual(null)
  })

  it('actions.createCrossing resolves to null when logged in as director when crossing format not legal', async () => {
    await logInAsDirector(store)

    const crossing = {
      ...validCrossing,
    }
    delete crossing.startDate

    const response = await store.dispatch('crossings/createCrossing', crossing)
    expect(response).toEqual(null)
  })

  it('actions.createCrossing creates a crossing when user logged in as director', async () => {
    await logInAsDirector(store)
    const response = await store.dispatch(
      'crossings/createCrossing',
      validCrossing
    )
    expect(response.id).toBeDefined()
  })

  it('actions.deleteCrossing resolves to null when not logged in', async () => {
    const response = await store.dispatch('crossings/deleteCrossing', 123)
    expect(response).toEqual(null)
  })

  it('actions.deleteCrossing resolves to null when crossing does not exist', async () => {
    await logInAsDirector(store)
    const crossings = await store.dispatch('crossings/fetchCrossings', {
      filters: {
        order: ['id DESC'],
      },
    })
    const latest = crossings[0]
    const unusedId = latest ? latest.id + 1 : 123

    const response = await store.dispatch('crossings/deleteCrossing', unusedId)
    expect(response).toEqual(null)
  })

  it('actions.deleteCrossing deletes a crossing and removes it from the crossing list', async () => {
    await logInAsDirector(store)

    // Create a crossing
    const crossing = {
      ...validCrossing,
      startDate: new Date().toISOString(),
    }
    const newCrossing = await store.dispatch(
      'crossings/createCrossing',
      crossing
    )
    expect(newCrossing.id).toBeDefined()

    // Fill the crossingList with at least the latest crossing
    await store.dispatch('crossings/fetchCrossings', {
      filters: {
        order: ['id DESC'],
      },
    })

    // Check that the crossing is in the crossingList
    expect(
      store.state.crossings.crossingList.some(
        (cross) => cross.id === newCrossing.id
      )
    ).toBe(true)

    // Delete the crossing
    const response = await store.dispatch(
      'crossings/deleteCrossing',
      newCrossing.id
    )
    // Has the deletion been confirmed
    expect(response).toBe(true)

    // Check that the crossing is no longer in the crossingList
    expect(
      store.state.crossings.crossingList.some(
        (cross) => cross.id === newCrossing.id
      )
    ).toBe(false)
  })

  it('actions.modifyCrossing resolves to true when crossing is modified', async () => {
    await logInAsDirector(store)

    // Create a crossing
    const crossing = {
      ...validCrossing,
      startDate: new Date().toISOString(),
    }
    const newCrossing = await store.dispatch(
      'crossings/createCrossing',
      crossing
    )
    expect(newCrossing.id).toBeDefined()

    const newDate = new Date().toISOString()

    const response = await store.dispatch('crossings/modifyCrossing', {
      id: newCrossing.id,
      changes: {
        startDate: newDate,
      },
    })
    expect(response).toEqual(true)
  })

  it('actions.modifyCrossing modifies the crossing', async () => {
    await logInAsDirector(store)

    // Create a crossing
    const crossing = {
      ...validCrossing,
      startDate: new Date().toISOString(),
    }
    const newCrossing = await store.dispatch(
      'crossings/createCrossing',
      crossing
    )
    expect(newCrossing.id).toBeDefined()

    // Define a new startDate
    const oneHour = 60 * 60 * 1000
    const oneDay = 24 * 60 * 60 * 1000
    const newDate = new Date(Date.now() + oneDay + oneHour)

    // Modify the crossing with the new startDate
    await store.dispatch('crossings/modifyCrossing', {
      id: newCrossing.id,
      changes: {
        startDate: newDate.toISOString(),
      },
    })

    // Refresh the crossing list
    const crossings = await store.dispatch('crossings/fetchCrossings', {
      filters: {
        order: ['id DESC'],
      },
    })
    const updatedCrossing = crossings.find(
      (cross) => cross.id === newCrossing.id
    )

    const updatedDate = new Date(updatedCrossing.startDate)
    expect(updatedDate.getFullYear()).toEqual(newDate.getFullYear())
    expect(updatedDate.getMonth()).toEqual(newDate.getMonth())
    expect(updatedDate.getDay()).toEqual(newDate.getDay())
    expect(updatedDate.getHours()).toEqual(newDate.getHours())
    expect(updatedDate.getMinutes()).toEqual(newDate.getMinutes())
  })

  it('actions.modifyCrossing modifies the crossing in the crossing list', async () => {
    await logInAsDirector(store)

    // Create a crossing
    const crossing = {
      ...validCrossing,
      startDate: new Date().toISOString(),
    }
    const newCrossing = await store.dispatch(
      'crossings/createCrossing',
      crossing
    )
    expect(newCrossing.id).toBeDefined()

    // Fill the crossingList with at least the latest crossing
    await store.dispatch('crossings/fetchCrossings', {
      filters: {
        order: ['id DESC'],
      },
    })

    // Check that the crossing is in the crossingList
    expect(
      store.state.crossings.crossingList.some(
        (cross) => cross.id === newCrossing.id
      )
    ).toBe(true)

    // Modify the crossing
    const newDate = new Date()
    await store.dispatch('crossings/modifyCrossing', {
      id: newCrossing.id,
      changes: {
        startDate: newDate.toISOString(),
      },
    })

    // Check that the informations about the crossing in the crossingList corresponds
    const updatedCrossing = store.state.crossings.crossingList.find(
      (cross) => cross.id === newCrossing.id
    )
    const updatedDate = new Date(updatedCrossing.startDate)
    expect(updatedDate.getFullYear()).toEqual(newDate.getFullYear())
    expect(updatedDate.getMonth()).toEqual(newDate.getMonth())
    expect(updatedDate.getDay()).toEqual(newDate.getDay())
    expect(updatedDate.getHours()).toEqual(newDate.getHours())
    expect(updatedDate.getMinutes()).toEqual(newDate.getMinutes())
  })

  it('actions.modifyCrossing resolves to null when not logged in', async () => {
    const response = await store.dispatch('crossings/modifyCrossing', {
      id: 123,
      changes: {
        startDate: new Date().toISOString(),
      },
    })
    expect(response).toEqual(null)
  })

  it('actions.modifyCrossing throws when not given an id', async () => {
    await logInAsDirector(store)
    await expect(
      store.dispatch('crossings/modifyCrossing', {
        changes: {
          startDate: new Date().toISOString(),
        },
      })
    ).rejects.toThrow(new Error('missing argument'))
  })

  it('actions.modifyCrossing throws when not given changes', async () => {
    await logInAsDirector(store)
    await expect(
      store.dispatch('crossings/modifyCrossing', {
        id: 123,
      })
    ).rejects.toThrow(new Error('missing argument'))
  })

  it('actions.modifyCrossing resolves to null when changes is an empty object', async () => {
    await logInAsDirector(store)
    const response = await store.dispatch('crossings/modifyCrossing', {
      id: 123,
      changes: {},
    })
    expect(response).toEqual(null)
  })

  it('actions.modifyCrossing resolves to null when crossing does not exist', async () => {
    await logInAsDirector(store)
    const crossings = await store.dispatch('crossings/fetchCrossings', {
      filters: {
        order: ['id DESC'],
      },
    })
    const latest = crossings[0]
    const unusedId = latest ? latest.id + 1 : 123

    const response = await store.dispatch('crossings/modifyCrossing', {
      id: unusedId,
      changes: {
        startDate: new Date().toISOString(),
      },
    })
    expect(response).toEqual(null)
  })

  it('actions.modifyCrossing resolves to null when given unprocessable entity', async () => {
    await logInAsDirector(store)

    // Create a crossing
    const crossing = {
      ...validCrossing,
      startDate: new Date().toISOString(),
    }
    const newCrossing = await store.dispatch(
      'crossings/createCrossing',
      crossing
    )
    expect(newCrossing.id).toBeDefined()

    const response = await store.dispatch('crossings/modifyCrossing', {
      id: newCrossing.id,
      changes: {
        foo: 'bar',
      },
    })
    expect(response).toEqual(null)
  })
})

const validCrossing = {
  duration: 20,
  audienceSize: 50,
  startDate: new Date().toISOString(),
}

const validCrossings = [
  {
    id: 1,
    duration: 20,
    audienceSize: 20,
    startDate: '2020-07-20T14:30:00.000Z',
  },
  {
    id: 2,
    duration: 30,
    audienceSize: 30,
    startDate: '2020-07-20T15:00:00.000Z',
  },
]

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
