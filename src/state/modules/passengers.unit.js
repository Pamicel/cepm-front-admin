import fs from 'fs'
import * as authModule from './auth'
import * as crossingsModule from './crossings'
import * as passengerParserModule from './passenger-parser'
import * as passengersModule from './passengers'

const helloAsso = fs
  .readFileSync(
    `${__dirname}/../../../tests/unit/__mocks__/hello-asso-valid-export.csv`
  )
  .toString()

describe('@state/modules/passengers', () => {
  let store
  beforeEach(async () => {
    store = createModuleStore({
      crossings: crossingsModule,
      auth: authModule,
      passengers: passengersModule,
      passengerParser: passengerParserModule,
    })
    window.localStorage.clear()
  })

  it('exports a valid Vuex module', () => {
    expect(passengersModule).toBeAVuexModule()
  })

  it('mutations["passengers/REPLACE_PASSENGER_LIST"] replaces the current crossing list with a new one', () => {
    const newValue = ['a', 'b', 'b']
    store.commit('passengers/REPLACE_PASSENGER_LIST', newValue)

    expect(store.state.passengers.passengerList).toEqual(newValue)
  })

  it('mutations["passengers/START_FETCHING_PASSENGERS"] sets fetchingPassengers to true', () => {
    store.commit('passengers/START_FETCHING_PASSENGERS')

    expect(store.state.passengers.fetchingPassengers).toEqual(true)
  })

  it('mutations["passengers/END_FETCHING_PASSENGERS"] sets fetchingPassengers to false', () => {
    store.commit('passengers/START_FETCHING_PASSENGERS')
    expect(store.state.passengers.fetchingPassengers).toEqual(true)
    store.commit('passengers/END_FETCHING_PASSENGERS')
    expect(store.state.passengers.fetchingPassengers).toEqual(false)
  })

  it('mutations["passengers/START_CREATING_PASSENGERS"] sets fetchingPassengers to true', () => {
    store.commit('passengers/START_CREATING_PASSENGERS')

    expect(store.state.passengers.creatingPassengers).toEqual(true)
  })

  it('mutations["passengers/END_CREATING_PASSENGERS"] sets creatingPassengers to false', () => {
    store.commit('passengers/START_CREATING_PASSENGERS')
    expect(store.state.passengers.creatingPassengers).toEqual(true)
    store.commit('passengers/END_CREATING_PASSENGERS')
    expect(store.state.passengers.creatingPassengers).toEqual(false)
  })

  it('actions["passengers/sendPassengers"] resolves to true after sending valid data', async () => {
    await logInAsDirector(store)
    const crossing = await store.dispatch(
      'crossings/createCrossing',
      validCrossing
    )
    expect(crossing.id).toBeDefined()

    /**
     * User parses a CSV which is saved in passengerParser.parsedData
     */
    await store.dispatch('passengerParser/parseCSV', helloAsso)

    /**
     *  User creates the fieldMap (mapping between csv column name and the
     *  corresponding column name the API understands)
     */
    const fieldMap = {
      bookerEmail: 'Email',
      bookerFirstName: 'Prénom acheteur',
      bookerLastName: 'Nom acheteur',
      firstName: 'Prénom',
      lastName: 'Nom',
      bookingIdentifier: 'Numéro',
      bookingType: 'Formule',
    }
    for (const apiEntry in fieldMap) {
      await store.dispatch('passengerParser/setFieldMapEntry', {
        apiEntry,
        originalEntry: fieldMap[apiEntry],
      })
    }

    const data = store.getters['passengerParser/dataDigest']

    const response = await store.dispatch('passengers/createPassengers', {
      crossingId: crossing.id,
      data,
      fieldMap,
    })

    expect(response).toBe(true)
  })

  it('actions["passengers/fetchPassengers"] resolves to the list of passengers', async () => {
    await logInAsDirector(store)
    const crossing = await store.dispatch(
      'crossings/createCrossing',
      validCrossing
    )
    expect(crossing.id).toBeDefined()

    /**
     * User parses a CSV which is saved in passengerParser.parsedData
     */
    await store.dispatch('passengerParser/parseCSV', helloAsso)

    /**
     *  User creates the fieldMap (mapping between csv column name and the
     *  corresponding column name the API understands)
     */
    const fieldMap = {
      bookerEmail: 'Email',
      bookerFirstName: 'Prénom acheteur',
      bookerLastName: 'Nom acheteur',
      firstName: 'Prénom',
      lastName: 'Nom',
      bookingIdentifier: 'Numéro',
      bookingType: 'Formule',
    }
    for (const apiEntry in fieldMap) {
      await store.dispatch('passengerParser/setFieldMapEntry', {
        apiEntry,
        originalEntry: fieldMap[apiEntry],
      })
    }

    const data = store.getters['passengerParser/dataDigest']

    await store.dispatch('passengers/createPassengers', {
      crossingId: crossing.id,
      data,
      fieldMap,
    })

    expect(store.state.passengers.passengerList.length).toBe(0)
    const result = await store.dispatch('passengers/fetchPassengers', {
      crossingId: crossing.id,
    })
    expect(store.state.passengers.passengerList.length).toBeGreaterThan(0)
    expect(result).toEqual(store.state.passengers.passengerList)
  })
})

const validCrossing = {
  duration: 20,
  audienceSize: 50,
  startDate: new Date().toISOString(),
}

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
