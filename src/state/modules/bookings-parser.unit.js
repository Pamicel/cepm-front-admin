import fs from 'fs'
import Papa from 'papaparse'
import * as bookingsParserModule from './bookings-parser'
const helloAsso = fs
  .readFileSync(
    `${__dirname}/../../../tests/unit/__mocks__/hello-asso-valid-export.csv`
  )
  .toString()

describe('@state/modules/bookings-parser', () => {
  let store
  beforeEach(async () => {
    store = createModuleStore({
      bookingsParser: bookingsParserModule,
    })
    window.localStorage.clear()
  })

  it('mutations["bookingsParser/SAVE_PARSING_ERRORS"] populates state.bookingsParser.parsingErrors', async () => {
    const data = ['a', 'b', 'c']
    store.commit('bookingsParser/SAVE_PARSING_ERRORS', data)
    expect(store.state.bookingsParser.parsingErrors).toEqual(data)
  })
  it('mutations["bookingsParser/RESET_PARSING_ERRORS"] sets state.bookingsParser.parsingErrors to [] ', async () => {
    store.commit('bookingsParser/RESET_PARSING_ERRORS')
    expect(store.state.bookingsParser.parsingErrors).toEqual([])
  })
  it('mutations["bookingsParser/SAVE_FIELDS"] populates state.bookingsParser.fields', async () => {
    const data = ['foo', 4, 'hi']
    store.commit('bookingsParser/SAVE_FIELDS', data)
    expect(store.state.bookingsParser.fields).toEqual(data)
  })
  it('mutations["bookingsParser/RESET_FIELDS"] sets state.bookingsParser.fields to []', async () => {
    store.commit('bookingsParser/RESET_FIELDS')
    expect(store.state.bookingsParser.fields).toEqual([])
  })
  it('mutations["bookingsParser/SET_FIELD_MAP_ENTRY"] fills the named entry in state.bookingsParser.fieldMap with the given value', async () => {
    const apiEntry = 'name of entry'
    const originalEntry = Infinity
    store.commit('bookingsParser/SET_FIELD_MAP_ENTRY', {
      apiEntry,
      originalEntry,
    })
    expect(store.state.bookingsParser.fieldMap[apiEntry]).toEqual(originalEntry)
  })
  it('mutations["bookingsParser/UNSET_FIELD_MAP_ENTRY"] sets the named entry in state.bookingsParser.fieldMap to null', async () => {
    const apiEntry = 'flugurblurg'
    store.commit('bookingsParser/UNSET_FIELD_MAP_ENTRY', {
      apiEntry,
    })
    expect(store.state.bookingsParser.fieldMap[apiEntry]).toEqual(null)
  })
  it('mutations["bookingsParser/RESET_FIELD_MAP"] sets all values in state.bookingsParser.fieldMap to null', async () => {
    store.commit('bookingsParser/RESET_FIELD_MAP')
    expect(
      Object.values(store.state.bookingsParser.fieldMap).every(
        (val) => val === null
      )
    ).toEqual(true)
  })
  it('mutations["bookingsParser/SAVE_DATA"] populates state.bookingsParser.parsedData', async () => {
    const data = ['mommy', 'why', 'Freud', 'Dolan']
    store.commit('bookingsParser/SAVE_DATA', data)
    expect(store.state.bookingsParser.parsedData).toEqual(data)
  })
  it('mutations["bookingsParser/RESET_DATA"] resets state.bookingsParser.parsedData to []', async () => {
    store.commit('bookingsParser/RESET_DATA')
    expect(store.state.bookingsParser.parsedData).toEqual([])
  })
  it('mutations["bookingsParser/SET_EMPTY_FIELDS"] populates state.bookingsParser.emptyFields', async () => {
    const data = ['this', 'is', 'different', 1337]
    store.commit('bookingsParser/SET_EMPTY_FIELDS', data)
    expect(store.state.bookingsParser.emptyFields).toEqual(data)
  })
  it('mutations["bookingsParser/RESET_EMPTY_FIELDS"] resets state.bookingsParser.emptyFields to []', async () => {
    store.commit('bookingsParser/RESET_EMPTY_FIELDS')
    expect(store.state.bookingsParser.emptyFields).toEqual([])
  })

  it('getters["bookingsParser/fieldMapComplete"] returns true when all fields in flieldMap are set', async () => {
    const before = store.getters['bookingsParser/fieldMapComplete']
    expect(before).toBe(false)

    const { fieldMap } = store.state.bookingsParser

    // NB there used to be more than one field and there might be more in the future
    // thus the loop
    for (const field of Object.keys(fieldMap)) {
      const apiEntry = field
      const originalEntry = 'whatsup'
      await store.dispatch('bookingsParser/setFieldMapEntry', {
        apiEntry,
        originalEntry,
      })
    }

    const after = store.getters['bookingsParser/fieldMapComplete']
    expect(after).toBe(true)
  })

  it('exports a valid Vuex module', () => {
    expect(bookingsParserModule).toBeAVuexModule()
  })

  it('actions["bookingsParser/parseCSV"] resolves with correct csv', async () => {
    const result = await store.dispatch('bookingsParser/parseCSV', helloAsso)
    expect(result).toBe(undefined)
  })

  it('actions["bookingsParser/parseCSV"] correctly saves data in state.bookingsParser.parsedData', async () => {
    const data = [
      {
        hi: 'hi',
        happyToMeet: 'you',
        CraigFergussonIs: 'a genius',
        trumpisanidiot: 'yes',
      },
    ]
    const csvString = Papa.unparse(data, {
      header: true,
      delimiter: ';',
    })

    await store.dispatch('bookingsParser/parseCSV', csvString)
    expect([...store.state.bookingsParser.fields].sort()).toEqual(
      Object.keys(data[0]).sort()
    )
    expect(store.state.bookingsParser.parsedData).toEqual(data)
  })

  it('actions["bookingsParser/parseCSV"] correctly saves empty fields in state.bookingsParser.emptyFields', async () => {
    /**
     * Empty fields are the fields that are empty (ie falsy) in all bookings
     *
     * here 'happyToMeet' is empty almost everywhere so should not be in emptyFields
     * while 'soulOfARepublican' is empty everywhere so should be in emptyFields
     */

    const data = [
      {
        hi: 'hi',
        happyToMeet: 'you',
        CraigFergussonIs: 'a genius',
        trumpisanidiot: 'yes',
        soulOfARepublican: '',
      },
      {
        hi: 'hi',
        happyToMeet: '',
        CraigFergussonIs: 'a genius',
        trumpisanidiot: 'yes',
        soulOfARepublican: '',
      },
      {
        hi: 'hi',
        happyToMeet: '',
        CraigFergussonIs: 'a genius',
        trumpisanidiot: 'yes',
        soulOfARepublican: '',
      },
      {
        hi: 'hi',
        happyToMeet: '',
        CraigFergussonIs: 'a genius',
        trumpisanidiot: 'yes',
        soulOfARepublican: '',
      },
      {
        hi: 'hi',
        happyToMeet: '',
        CraigFergussonIs: 'a genius',
        trumpisanidiot: 'yes',
        soulOfARepublican: '',
      },
      {
        hi: 'hi',
        happyToMeet: '',
        CraigFergussonIs: 'a genius',
        trumpisanidiot: 'yes',
        soulOfARepublican: '',
      },
      {
        hi: 'hi',
        happyToMeet: '',
        CraigFergussonIs: 'a genius',
        trumpisanidiot: 'yes',
        soulOfARepublican: '',
      },
    ]
    const csvString = Papa.unparse(data, {
      header: true,
      delimiter: ';',
    })

    await store.dispatch('bookingsParser/parseCSV', csvString)
    expect(store.state.bookingsParser.emptyFields).toEqual([
      'soulOfARepublican',
    ])
  })

  it('actions["bookingsParser/setFieldMapEntry"] sets the entry in state.bookingsParser.fieldMap', async () => {
    const apiEntry = 'bookerEmail'
    const originalEntry = 'whatsup'

    await store.dispatch('bookingsParser/setFieldMapEntry', {
      apiEntry,
      originalEntry,
    })
    expect(store.state.bookingsParser.fieldMap[apiEntry]).toEqual(originalEntry)
  })

  it('actions["bookingsParser/unsetFieldMapEntry"] unsets the entry in state.bookingsParser.fieldMap', async () => {
    const apiEntry = 'bookerEmail'

    await store.dispatch('bookingsParser/setFieldMapEntry', {
      apiEntry,
      originalEntry: 'random whatever',
    })
    await store.dispatch('bookingsParser/unsetFieldMapEntry', {
      apiEntry,
    })
    expect(store.state.bookingsParser.fieldMap[apiEntry]).toEqual(null)
  })

  it('getters["bookingsParser/dataDigest"] returns the same data but digestible by the api', async () => {
    const data = [
      {
        hi: 'hi',
        happyToMeet: 'you',
        CraigFergussonIs: 'a genius',
        trumpisanidiot: 'yes',
        trumpisacriminal: 'also yes',
        blip: 'bip boup bip',
      },
    ]

    const fieldMap = {
      bookerEmail: 'hi',
    }

    const digestedData = data.map((row) => {
      const digestedRow = {}
      for (const [apiEntry, originalEntry] of Object.entries(fieldMap)) {
        digestedRow[apiEntry] = row[originalEntry]
      }
      digestedRow.raw = JSON.stringify(row)
      return digestedRow
    })

    const csvString = Papa.unparse(data, {
      header: true,
      delimiter: ';',
    })
    await store.dispatch('bookingsParser/parseCSV', csvString)
    for (const [apiEntry, originalEntry] of Object.entries(fieldMap)) {
      await store.dispatch('bookingsParser/setFieldMapEntry', {
        apiEntry,
        originalEntry,
      })
    }

    expect(
      JSON.parse(store.getters['bookingsParser/dataDigest'][0].raw)
    ).toEqual(data[0])
    expect({
      ...store.getters['bookingsParser/dataDigest'],
      raw: undefined,
    }).toEqual({
      ...digestedData,
      raw: undefined,
    })
  })
})
