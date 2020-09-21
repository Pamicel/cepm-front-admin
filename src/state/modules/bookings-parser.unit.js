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
    const data = ['a', 'b', 'c']
    store.commit('bookingsParser/SAVE_PARSING_ERRORS', data)
    expect(store.state.bookingsParser.parsingErrors).toEqual(data)
    store.commit('bookingsParser/RESET_PARSING_ERRORS')
    expect(store.state.bookingsParser.parsingErrors).toEqual([])
  })
  it('mutations["bookingsParser/SAVE_FIELDS"] populates state.bookingsParser.fields', async () => {
    const data = ['foo', 4, 'hi']
    store.commit('bookingsParser/SAVE_FIELDS', data)
    expect(store.state.bookingsParser.fields).toEqual(data)
  })
  it('mutations["bookingsParser/RESET_FIELDS"] sets state.bookingsParser.fields to []', async () => {
    const data = ['foo', 4, 'hi']
    store.commit('bookingsParser/SAVE_FIELDS', data)
    expect(store.state.bookingsParser.fields).toEqual(data)
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
    const apiEntry = 'name of entry'
    const originalEntry = Infinity
    store.commit('bookingsParser/SET_FIELD_MAP_ENTRY', {
      apiEntry,
      originalEntry,
    })
    expect(store.state.bookingsParser.fieldMap[apiEntry]).toEqual(originalEntry)
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
    const data = ['mommy', 'why', 'Freud', 'Dolan']
    store.commit('bookingsParser/SAVE_DATA', data)
    expect(store.state.bookingsParser.parsedData).toEqual(data)
    store.commit('bookingsParser/RESET_DATA')
    expect(store.state.bookingsParser.parsedData).toEqual([])
  })
  it('mutations["bookingsParser/SET_EMPTY_FIELDS"] populates state.bookingsParser.emptyFields', async () => {
    const data = ['this', 'is', 'different', 1337]
    store.commit('bookingsParser/SET_EMPTY_FIELDS', data)
    expect(store.state.bookingsParser.emptyFields).toEqual(data)
  })
  it('mutations["bookingsParser/RESET_EMPTY_FIELDS"] resets state.bookingsParser.emptyFields to []', async () => {
    const data = ['this', 'is', 'different', 1337]
    store.commit('bookingsParser/SET_EMPTY_FIELDS', data)
    expect(store.state.bookingsParser.emptyFields).toEqual(data)
    store.commit('bookingsParser/RESET_EMPTY_FIELDS')
    expect(store.state.bookingsParser.emptyFields).toEqual([])
  })

  it('actions["bookingsParser/reset"] resets everything to its initial value', async () => {
    // Fill the state with arbitrary values

    // parsingError
    const parsingErrors = ['a', 'b', 'c']
    store.commit('bookingsParser/SAVE_PARSING_ERRORS', parsingErrors)
    // fields
    const fields = ['foo', 4, 'hi']
    store.commit('bookingsParser/SAVE_FIELDS', fields)
    // fieldMap
    const apiEntry = 'name of entry'
    const originalEntry = Infinity
    store.commit('bookingsParser/SET_FIELD_MAP_ENTRY', {
      apiEntry,
      originalEntry,
    })
    // emptyFields
    const emptyFields = ['this', 'is', 'different', 1337]
    store.commit('bookingsParser/SET_EMPTY_FIELDS', emptyFields)
    // data
    const data = ['mommy', 'why', 'Freud', 'Dolan']
    store.commit('bookingsParser/SAVE_DATA', data)

    // Reset everything

    store.dispatch('bookingsParser/reset')

    // Check that the state is at its initial value after reset

    // parsingErrors
    expect(store.state.bookingsParser.parsingErrors).toEqual([])
    // fields
    expect(store.state.bookingsParser.fields).toEqual([])
    // fieldMap
    const fieldMapValues = Object.values(store.state.bookingsParser.fieldMap)
    const isNull = (val) => val === null
    expect(fieldMapValues.every(isNull)).toEqual(true)
    // emptyFields
    expect(store.state.bookingsParser.emptyFields).toEqual([])
    // data
    expect(store.state.bookingsParser.parsedData).toEqual([])
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

  it('actions["bookingsParser/parseCSV"] resolves with correct csv string', async () => {
    const result = await store.dispatch('bookingsParser/parseCSV', helloAsso)
    expect(result).toBe(undefined)
  })

  it('actions["bookingsParser/parseCSV"] resolves with correct csv file', async () => {
    const file = new File([helloAsso], 'helloAsso.csv', {
      type: 'text/csv',
    })
    const result = await store.dispatch('bookingsParser/parseCSV', file)
    expect(result).toBe(undefined)
  })

  it('actions["bookingsParser/parseCSV"] throws with csv file with incorrect mime type', async () => {
    const file = new File([helloAsso], 'helloAsso.csv', {
      type: 'text/plain',
    })
    await expect(
      store.dispatch('bookingsParser/parseCSV', file)
    ).rejects.toThrow('Invalid file type')
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

  it('actions["bookingsParser/parseCSV"] sets parsing error when csv is not correct', async () => {
    const csvString = invalidCSVStrings.missingQuotes
    await store.dispatch('bookingsParser/parseCSV', csvString)
    expect(store.state.bookingsParser.parsingErrors.length > 0).toBe(true)
  })

  it('actions["bookingsParser/parseCSV"] has parsing error type "Quotes" when csv has mismatched quotes', async () => {
    const csvString = invalidCSVStrings.missingQuotes
    await store.dispatch('bookingsParser/parseCSV', csvString)
    const hasMissingQuotesError = !!store.state.bookingsParser.parsingErrors.find(
      (error) => error.type === 'Quotes'
    )
    expect(hasMissingQuotesError).toBe(true)
  })

  it('actions["bookingsParser/parseCSV"] has parsing error type "FieldMismatch" when csv has rows either too long or too short', async () => {
    const csvString = `"ID","Name","Org_ID","TransType","Amount"
    "1453","John Joe","AZ7629","CREDIT_CARD","23.44","ONE MORE COLUMN"
    "1455","Donny","13DSFKJ","CASH"
    "1480","Big Guy","CREDIT_CARD","3.43"`
    await store.dispatch('bookingsParser/parseCSV', csvString)
    const hasFieldMismatchError = !!store.state.bookingsParser.parsingErrors.find(
      (error) => error.type === 'FieldMismatch'
    )
    expect(hasFieldMismatchError).toBe(true)
  })

  it('actions["bookingsParser/parseCSV"] parses anyway when csv has rows either too long or too short', async () => {
    const csvString = `"ID","Name","Org_ID","TransType","Amount"
    "1453","John Joe","AZ7629","CREDIT_CARD","23.44","ONE MORE COLUMN"
    "1455","Donny","13DSFKJ","CASH"
    "1480","Big Guy","CREDIT_CARD","3.43"`
    await store.dispatch('bookingsParser/parseCSV', csvString)
    const allRowsParsed = store.state.bookingsParser.parsedData.length === 3
    expect(allRowsParsed).toBe(true)
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

  it('getters["bookingsParser/rowsWithMissingRequiredFields"] returns all rows that have missing required values', async () => {
    const incomplete = [
      {
        id: '2', // everything is string because the data is parsed to csv and back
        hello: '', // maps to the required
      },
      {
        id: '3',
        hello: '',
      },
    ]
    const complete = [
      {
        id: '1',
        hello: 'hi',
      },
    ]

    const data = [...incomplete, ...complete]

    const fieldMap = {
      bookerEmail: 'hello',
    }

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
      store.getters['bookingsParser/rowsWithMissingRequiredFields']
    ).toEqual(incomplete)
  })
})

const invalidCSVStrings = {
  missingQuotes: `"ID","Name","Org_ID","TransType","Amount"
  "1453","John Joe","AZ7629","CREDIT_CARD,"23.44"
  "1455","Donny","13DSFKJ","CASH","2.33"
  "1480","Big Guy","FEID123","CREDIT_CARD","3.43"`,

  allInvalidRows: `"ID","Name","Org_ID","TransType","Amount"
  "1453","John Joe","AZ7629","CREDIT_CARD","23.44","ONE MORE COLUMN"
  "1455","Donny","13DSFKJ","CASH"
  "1480","Big Guy","CREDIT_CARD","3.43"`,

  someInvalidRows: `"ID","Name","Org_ID","TransType","Amount"
  "1453","John Joe","AZ7629","CREDIT_CARD","23.44",
  "1455","Donny","13DSFKJ","CASH","2.33","ONE MORE COLUMN"
  "1480","Big Guy","FEID123","CREDIT_CARD","3.43"`,
}
