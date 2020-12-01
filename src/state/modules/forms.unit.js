import * as formsModule from './forms'
import * as authModule from './auth'

describe('@state/modules/forms', () => {
  let store
  beforeEach(async () => {
    store = createModuleStore({
      auth: authModule,
      forms: formsModule,
    })
    window.localStorage.clear()
  })

  it('exports a valid Vuex module', () => {
    expect(formsModule).toBeAVuexModule()
  })

  it('mutation SAVE_FIRMS saves the firms', () => {
    const firms = ['a', 'b', 'c']

    store.commit('forms/SAVE_FIRMS', firms)
    expect(store.state.forms.firms).toEqual(firms)
  })

  it('mutation RESET_FIRMS sets state.firms back to []', () => {
    const firms = ['a', 'b', 'c']

    store.commit('forms/SAVE_FIRMS', firms)
    expect(store.state.forms.firms).toEqual(firms)
    store.commit('forms/RESET_FIRMS')
    expect(store.state.forms.firms).toEqual([])
  })

  it('mutation SET_FIRMS_PAGE sets state.firmsPage', () => {
    const page = 'any value'
    store.commit('forms/SET_FIRMS_PAGE', page)
    expect(store.state.forms.firmsPage).toEqual(page)
  })

  it('mutation SAVE_FIRM_DETAILS given firm, updates value to this firm in state.firms with same id', () => {
    const firms = [{ id: '1' }, { id: '2' }, { id: '3' }]
    store.commit('forms/SAVE_FIRMS', firms)
    const detailedFirm = { ...firms[0], newEntry: 'any value' }
    store.commit('forms/SAVE_FIRM_DETAILS', detailedFirm)
    expect(store.state.forms.firms).not.toEqual(firms)
    const updatedFirms = firms.map((firm) =>
      firm.id === detailedFirm.id ? detailedFirm : firm
    )
    expect(store.state.forms.firms).toEqual(updatedFirms)
  })

  it('mutation SAVE_FIRM_DETAILS given firm, adds this firm in state.firms if not present', () => {
    const firms = [{ id: '1' }, { id: '2' }, { id: '3' }]
    store.commit('forms/SAVE_FIRMS', firms)
    const detailedFirm = { id: '4', newEntry: 'any value' }
    store.commit('forms/SAVE_FIRM_DETAILS', detailedFirm)
    expect(store.state.forms.firms).not.toEqual(firms)
    const updatedFirms = [...firms, detailedFirm]
    expect(store.state.forms.firms).toEqual(updatedFirms)
  })

  it('mutations START_FETCHING_FIRMS set fetchingFirms to true', () => {
    expect(store.state.forms.fetchingFirms).toEqual(false)
    store.commit('forms/START_FETCHING_FIRMS')
    expect(store.state.forms.fetchingFirms).toEqual(true)
  })
  it('mutations START_FETCHING_FIRMS set fetchingFirms to true', () => {
    store.commit('forms/START_FETCHING_FIRMS')
    expect(store.state.forms.fetchingFirms).toEqual(true)
    store.commit('forms/END_FETCHING_FIRMS')
    expect(store.state.forms.fetchingFirms).toEqual(false)
  })

  it('mutation START_FETCHING_FIRM_DETAILS sets the values of fetchingFirmsDetails', async () => {
    expect(store.state.forms.fetchingFirmsDetails).toEqual([])
    const value1 = 'abc'
    const value2 = 123
    store.commit('forms/START_FETCHING_FIRM_DETAILS', value1)
    store.commit('forms/START_FETCHING_FIRM_DETAILS', value2)
    expect(store.state.forms.fetchingFirmsDetails).toContain(value1)
    expect(store.state.forms.fetchingFirmsDetails).toContain(value2)
  })
  it('mutation START_FETCHING_FIRM_DETAILS sets the values of fetchingFirmsDetails only once', async () => {
    expect(store.state.forms.fetchingFirmsDetails).toEqual([])
    const value = 'abc'
    store.commit('forms/START_FETCHING_FIRM_DETAILS', value)
    store.commit('forms/START_FETCHING_FIRM_DETAILS', value)
    expect(store.state.forms.fetchingFirmsDetails).toEqual([value])
  })
  it('mutation END_FETCHING_FIRM_DETAILS removed the specific value from fetchingFirmsDetails', async () => {
    const value1 = 'monsieur'
    const value2 = 'madame'
    store.commit('forms/START_FETCHING_FIRM_DETAILS', value1)
    store.commit('forms/START_FETCHING_FIRM_DETAILS', value2)
    expect(store.state.forms.fetchingFirmsDetails).toContain(value1)
    expect(store.state.forms.fetchingFirmsDetails).toContain(value2)
    store.commit('forms/END_FETCHING_FIRM_DETAILS', value1)
    expect(store.state.forms.fetchingFirmsDetails).not.toContain(value1)
    expect(store.state.forms.fetchingFirmsDetails).toContain(value2)
  })
})
