import fs from 'fs'
import Papa from 'papaparse'
import * as passengerParserModule from './passenger-parser'
const helloAsso = fs
  .readFileSync(
    `${__dirname}/../../../tests/unit/__mocks__/hello-asso-valid-export.csv`
  )
  .toString()

describe('@state/modules/passenger-parser', () => {
  let store
  beforeEach(async () => {
    store = createModuleStore({
      passengerParser: passengerParserModule,
    })
    window.localStorage.clear()
  })

  it('mutations["passengerParser/SAVE_PARSING_ERRORS"] populates state.passengerParser.parsingErrors', async () => {
    const data = ['a', 'b', 'c']
    store.commit('passengerParser/SAVE_PARSING_ERRORS', data)
    expect(store.state.passengerParser.parsingErrors).toEqual(data)
  })
  it('mutations["passengerParser/RESET_PARSING_ERRORS"] sets state.passengerParser.parsingErrors to [] ', async () => {
    store.commit('passengerParser/RESET_PARSING_ERRORS')
    expect(store.state.passengerParser.parsingErrors).toEqual([])
  })
  it('mutations["passengerParser/SAVE_FIELDS"] populates state.passengerParser.fields', async () => {
    const data = ['foo', 4, 'hi']
    store.commit('passengerParser/SAVE_FIELDS', data)
    expect(store.state.passengerParser.fields).toEqual(data)
  })
  it('mutations["passengerParser/RESET_FIELDS"] sets state.passengerParser.fields to []', async () => {
    store.commit('passengerParser/RESET_FIELDS')
    expect(store.state.passengerParser.fields).toEqual([])
  })
  it('mutations["passengerParser/SET_FIELD_MAP_ENTRY"] fills the named entry in state.passengerParser.fieldMap with the given value', async () => {
    const apiEntry = 'name of entry'
    const originalEntry = Infinity
    store.commit('passengerParser/SET_FIELD_MAP_ENTRY', {
      apiEntry,
      originalEntry,
    })
    expect(store.state.passengerParser.fieldMap[apiEntry]).toEqual(
      originalEntry
    )
  })
  it('mutations["passengerParser/UNSET_FIELD_MAP_ENTRY"] sets the named entry in state.passengerParser.fieldMap to null', async () => {
    const apiEntry = 'flugurblurg'
    store.commit('passengerParser/UNSET_FIELD_MAP_ENTRY', {
      apiEntry,
    })
    expect(store.state.passengerParser.fieldMap[apiEntry]).toEqual(null)
  })
  it('mutations["passengerParser/RESET_FIELD_MAP"] sets all values in state.passengerParser.fieldMap to null', async () => {
    store.commit('passengerParser/RESET_FIELD_MAP')
    expect(
      Object.values(store.state.passengerParser.fieldMap).every(
        (val) => val === null
      )
    ).toEqual(true)
  })
  it('mutations["passengerParser/SAVE_DATA"] populates state.passengerParser.parsedData', async () => {
    const data = ['mommy', 'why', 'Freud', 'Dolan']
    store.commit('passengerParser/SAVE_DATA', data)
    expect(store.state.passengerParser.parsedData).toEqual(data)
  })
  it('mutations["passengerParser/RESET_DATA"] resets state.passengerParser.parsedData to []', async () => {
    store.commit('passengerParser/RESET_DATA')
    expect(store.state.passengerParser.parsedData).toEqual([])
  })
  it('mutations["passengerParser/SET_EMPTY_FIELDS"] populates state.passengerParser.emptyFields', async () => {
    const data = ['this', 'is', 'different', 1337]
    store.commit('passengerParser/SET_EMPTY_FIELDS', data)
    expect(store.state.passengerParser.emptyFields).toEqual(data)
  })
  it('mutations["passengerParser/RESET_EMPTY_FIELDS"] resets state.passengerParser.emptyFields to []', async () => {
    store.commit('passengerParser/RESET_EMPTY_FIELDS')
    expect(store.state.passengerParser.emptyFields).toEqual([])
  })

  it('exports a valid Vuex module', () => {
    expect(passengerParserModule).toBeAVuexModule()
  })

  it('actions["passengerParser/parseCSV"] resolves with correct csv', async () => {
    const result = await store.dispatch('passengerParser/parseCSV', helloAsso)
    expect(result).toBe(undefined)
  })

  it('actions["passengerParser/parseCSV"] correctly saves data in state.passengerParser.parsedData', async () => {
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

    await store.dispatch('passengerParser/parseCSV', csvString)
    expect([...store.state.passengerParser.fields].sort()).toEqual(
      Object.keys(data[0]).sort()
    )
    expect(store.state.passengerParser.parsedData).toEqual(data)
  })

  it('actions["passengerParser/parseCSV"] correctly saves empty fields in state.passengerParser.emptyFields', async () => {
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

    await store.dispatch('passengerParser/parseCSV', csvString)
    expect(store.state.passengerParser.emptyFields).toEqual([
      'soulOfARepublican',
    ])
  })

  it('actions["passengerParser/setFieldMapEntry"] sets the entry in state.passengerParser.fieldMap', async () => {
    const apiEntry = 'bookerEmail'
    const originalEntry = 'whatsup'

    await store.dispatch('passengerParser/setFieldMapEntry', {
      apiEntry,
      originalEntry,
    })
    expect(store.state.passengerParser.fieldMap[apiEntry]).toEqual(
      originalEntry
    )
  })

  it('actions["passengerParser/unsetFieldMapEntry"] unsets the entry in state.passengerParser.fieldMap', async () => {
    const apiEntry = 'bookerFirstName'

    await store.dispatch('passengerParser/setFieldMapEntry', {
      apiEntry,
      originalEntry: 'random whatever',
    })
    await store.dispatch('passengerParser/unsetFieldMapEntry', {
      apiEntry,
    })
    expect(store.state.passengerParser.fieldMap[apiEntry]).toEqual(null)
  })

  it('getters["passengerParser/dataDigest"] returns the same data but digestible by the api', async () => {
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
      bookerFirstName: 'happyToMeet',
      bookerLastName: 'CraigFergussonIs',
      firstName: 'trumpisanidiot',
      lastName: 'trumpisacriminal',
      bookingIdentifier: 'blip',
      bookingType: 'blip',
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
    await store.dispatch('passengerParser/parseCSV', csvString)
    for (const [apiEntry, originalEntry] of Object.entries(fieldMap)) {
      await store.dispatch('passengerParser/setFieldMapEntry', {
        apiEntry,
        originalEntry,
      })
    }

    expect(
      JSON.parse(store.getters['passengerParser/dataDigest'][0].raw)
    ).toEqual(data[0])
    expect({
      ...store.getters['passengerParser/dataDigest'],
      raw: undefined,
    }).toEqual({
      ...digestedData,
      raw: undefined,
    })
  })
})
