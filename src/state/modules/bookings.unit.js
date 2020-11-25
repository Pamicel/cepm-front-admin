import fs from 'fs'
import * as authModule from './auth'
import * as crossingsModule from './crossings'
import * as bookingsParserModule from './bookings-parser'
import * as bookingsModule from './bookings'

const helloAsso = fs
  .readFileSync(
    `${__dirname}/../../../tests/unit/__mocks__/hello-asso-valid-export.csv`
  )
  .toString()

describe('@state/modules/bookings', () => {
  let store
  beforeEach(async () => {
    store = createModuleStore({
      crossings: crossingsModule,
      auth: authModule,
      bookings: bookingsModule,
      bookingsParser: bookingsParserModule,
    })
    window.localStorage.clear()
  })

  it('exports a valid Vuex module', () => {
    expect(bookingsModule).toBeAVuexModule()
  })

  it('mutations["bookings/REPLACE_BOOKING_LIST"] replaces the current crossing list with a new one', () => {
    const newValue = ['a', 'b', 'b']
    store.commit('bookings/REPLACE_BOOKING_LIST', newValue)

    expect(store.state.bookings.bookingList).toEqual(newValue)
  })

  it('mutations["bookings/START_FETCHING_BOOKINGS"] sets fetchingBookings to true', () => {
    store.commit('bookings/START_FETCHING_BOOKINGS')

    expect(store.state.bookings.fetchingBookings).toEqual(true)
  })

  it('mutations["bookings/END_FETCHING_BOOKINGS"] sets fetchingBookings to false', () => {
    store.commit('bookings/START_FETCHING_BOOKINGS')
    expect(store.state.bookings.fetchingBookings).toEqual(true)
    store.commit('bookings/END_FETCHING_BOOKINGS')
    expect(store.state.bookings.fetchingBookings).toEqual(false)
  })

  it('mutations["bookings/START_CREATING_BOOKINGS"] sets fetchingBookings to true', () => {
    store.commit('bookings/START_CREATING_BOOKINGS')

    expect(store.state.bookings.creatingBookings).toEqual(true)
  })

  it('mutations["bookings/SET_BOOKING_CREATION_RESPONSE"] sets the value of bookingCreationResponse', () => {
    expect(store.state.bookings.bookingCreationResponse).toEqual({})

    const value = 'fdslkjfsd'
    store.commit('bookings/SET_BOOKING_CREATION_RESPONSE', value)

    expect(store.state.bookings.bookingCreationResponse).toEqual(value)
  })

  it('mutations["bookings/START_CREATING_BOOKINGS"] resets bookingCreationResponse to {}', () => {
    const value = 'fdslkjfsd'
    store.commit('bookings/SET_BOOKING_CREATION_RESPONSE', value)
    expect(store.state.bookings.bookingCreationResponse).toEqual(value)

    store.commit('bookings/START_CREATING_BOOKINGS')
    expect(store.state.bookings.bookingCreationResponse).toEqual({})
  })

  it('mutations["bookings/END_CREATING_BOOKINGS"] sets creatingBookings to false', () => {
    store.commit('bookings/START_CREATING_BOOKINGS')
    expect(store.state.bookings.creatingBookings).toEqual(true)
    store.commit('bookings/END_CREATING_BOOKINGS')
    expect(store.state.bookings.creatingBookings).toEqual(false)
  })

  it('actions["bookings/sendBookings"] resolves to true after sending valid data', async () => {
    await logInAsDirector(store)
    const crossing = await store.dispatch(
      'crossings/createCrossing',
      validCrossing
    )
    expect(crossing.id).toBeDefined()

    /**
     * User parses a CSV which is saved in bookingsParser.parsedData
     */
    await store.dispatch('bookingsParser/parseCSV', helloAsso)

    /**
     *  User creates the fieldMap (mapping between csv column name and the
     *  corresponding column name the API understands)
     */
    const fieldMap = {
      bookerEmail: 'Email',
    }
    for (const apiEntry in fieldMap) {
      await store.dispatch('bookingsParser/setFieldMapEntry', {
        apiEntry,
        originalEntry: fieldMap[apiEntry],
      })
    }

    const data = store.getters['bookingsParser/dataDigest']

    const response = await store.dispatch('bookings/createBookings', {
      crossingId: crossing.id,
      data,
      fieldMap,
    })

    expect(response).toBe(true)
  })

  it('actions["bookings/fetchBookings"] resolves to the list of bookings', async () => {
    await logInAsDirector(store)
    const crossing = await store.dispatch(
      'crossings/createCrossing',
      validCrossing
    )
    expect(crossing.id).toBeDefined()

    /**
     * User parses a CSV which is saved in bookingsParser.parsedData
     */
    await store.dispatch('bookingsParser/parseCSV', helloAsso)

    /**
     *  User creates the fieldMap (mapping between csv column name and the
     *  corresponding column name the API understands)
     */
    const fieldMap = {
      bookerEmail: 'Email',
    }
    for (const apiEntry in fieldMap) {
      await store.dispatch('bookingsParser/setFieldMapEntry', {
        apiEntry,
        originalEntry: fieldMap[apiEntry],
      })
    }

    const data = store.getters['bookingsParser/dataDigest']

    await store.dispatch('bookings/createBookings', {
      crossingId: crossing.id,
      data,
      fieldMap,
    })

    expect(store.state.bookings.bookingList.length).toBe(0)
    const result = await store.dispatch('bookings/fetchBookings', {
      crossingId: crossing.id,
    })
    expect(store.state.bookings.bookingList.length).toBeGreaterThan(0)
    expect(result).toEqual(store.state.bookings.bookingList)
  })

  // Email to booker
  it('mutations["bookings/START_SENDING_EMAIL_TO_BOOKER"] sets the values of sendingEmailToBookers', async () => {
    expect(store.state.bookings.sendingEmailToBookers).toEqual([])
    const value1 = 'abc'
    const value2 = 123
    store.commit('bookings/START_SENDING_EMAIL_TO_BOOKER', value1)
    store.commit('bookings/START_SENDING_EMAIL_TO_BOOKER', value2)
    expect(store.state.bookings.sendingEmailToBookers).toContain(value1)
    expect(store.state.bookings.sendingEmailToBookers).toContain(value2)
  })
  it('mutations["bookings/START_SENDING_EMAIL_TO_BOOKER"] sets the values of sendingEmailToBookers only once', async () => {
    expect(store.state.bookings.sendingEmailToBookers).toEqual([])
    const value = 'abc'
    store.commit('bookings/START_SENDING_EMAIL_TO_BOOKER', value)
    store.commit('bookings/START_SENDING_EMAIL_TO_BOOKER', value)
    expect(store.state.bookings.sendingEmailToBookers).toEqual([value])
  })
  it('mutations["bookings/END_SENDING_EMAIL_TO_BOOKER"] removed the specific value from sendingEmailToBookers', async () => {
    const value1 = 'monsieur'
    const value2 = 'madame'
    store.commit('bookings/START_SENDING_EMAIL_TO_BOOKER', value1)
    store.commit('bookings/START_SENDING_EMAIL_TO_BOOKER', value2)
    expect(store.state.bookings.sendingEmailToBookers).toContain(value1)
    expect(store.state.bookings.sendingEmailToBookers).toContain(value2)
    store.commit('bookings/END_SENDING_EMAIL_TO_BOOKER', value1)
    expect(store.state.bookings.sendingEmailToBookers).not.toContain(value1)
    expect(store.state.bookings.sendingEmailToBookers).toContain(value2)
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
