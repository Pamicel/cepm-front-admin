import Papa from 'papaparse'

const initialFieldMap = {
  bookerEmail: null, // Email
}

export const state = {
  parsingErrors: [
    /*
      useful example of parsing error:
      {
        type: 'FieldMismatch',
        code: 'TooFewFields',
        message: 'Too few fields: expected 24 fields but parsed 1',
        row: 69
      }
    */
  ],
  fields: [],
  /**
   * The fieldMap is the mapping between the fields the API expects and
   * their corresponding name in the parsed data
   *
   * eg
   * Say the API expects only an "email" field for each passenger.
   * Now say the data format for passengers is as follows:
   *  {
   *    emailAddress: "hello@iamjohn.eg"
   *    name: "John"
   *  }
   * Then the expected fieldMap would look like this
   *  {
   *    email: "emailAddress"
   *  }
   *
   */
  fieldMap: {
    ...initialFieldMap,
  },
  emptyFields: [],
  parsedData: [],
}

export const getters = {
  /**
   * Transforms the parsed data into something the API can consume
   */
  dataDigest(state) {
    const { parsedData, fieldMap } = state

    const data = parsedData.map((parsedPassenger) => {
      const passenger = {}
      for (const [apiEntry, originalEntry] of Object.entries(fieldMap)) {
        passenger[apiEntry] = parsedPassenger[originalEntry]
      }
      passenger.raw = JSON.stringify(parsedPassenger)
      return passenger
    })

    return data
  },
  fieldMapComplete(state) {
    const { fieldMap } = state

    return Object.entries(fieldMap).every(
      ([key, value]) => value !== initialFieldMap[key] // is different from the default value
    )
  },
}

export const mutations = {
  SAVE_PARSING_ERRORS(state, newValue = []) {
    state.parsingErrors = [...newValue]
  },
  RESET_PARSING_ERRORS(state) {
    state.parsingErrors = []
  },
  SAVE_FIELDS(state, newValue = []) {
    state.fields = [...newValue]
  },
  RESET_FIELDS(state) {
    state.fields = []
  },
  SET_FIELD_MAP_ENTRY(state, { apiEntry, originalEntry }) {
    state.fieldMap[apiEntry] = originalEntry
  },
  UNSET_FIELD_MAP_ENTRY(state, { apiEntry }) {
    state.fieldMap[apiEntry] = null
  },
  RESET_FIELD_MAP(state) {
    state.fieldMap = {
      ...initialFieldMap,
    }
  },
  SAVE_DATA(state, parsedData) {
    state.parsedData = parsedData
  },
  RESET_DATA(state) {
    state.parsedData = []
  },
  SET_EMPTY_FIELDS(state, emptyFields) {
    state.emptyFields = emptyFields
  },
  RESET_EMPTY_FIELDS(state) {
    state.emptyFields = []
  },
}

export const actions = {
  parseCSV({ commit }, csv) {
    commit('RESET_PARSING_ERRORS')
    commit('RESET_FIELDS')
    commit('RESET_DATA')
    commit('RESET_EMPTY_FIELDS')

    // Parse the csv
    const parsedCSV = Papa.parse(csv, {
      header: true,
    })
    const { errors, meta, data } = parsedCSV

    // Save the fields
    if (meta && meta.fields) {
      commit('SAVE_FIELDS', meta.fields)
    }

    // Save the errors
    if (errors && errors.length) {
      commit('SAVE_PARSING_ERRORS', errors)
    }

    // Save the data
    if (data) {
      commit('SAVE_DATA', data)
    }

    if (meta && meta.fields && data) {
      let emptyFields = [...meta.fields]
      for (const booking of data) {
        // Only keep the fields that have no entries
        emptyFields = emptyFields.filter((field) => !booking[field])
      }
      commit('SET_EMPTY_FIELDS', emptyFields)
    }
  },

  setFieldMapEntry({ commit }, { apiEntry, originalEntry }) {
    if (!Object.keys(initialFieldMap).includes(apiEntry)) {
      throw new Error('Incorrect field map api entry')
    }

    commit('SET_FIELD_MAP_ENTRY', {
      apiEntry,
      originalEntry,
    })
  },
  unsetFieldMapEntry({ commit }, { apiEntry }) {
    commit('UNSET_FIELD_MAP_ENTRY', {
      apiEntry,
    })
  },
}
