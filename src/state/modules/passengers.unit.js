import * as passengersModule from './passengers'

describe('@state/modules/passengers', () => {
  it('exports a valid Vuex module', () => {
    expect(passengersModule).toBeAVuexModule()
  })
})
