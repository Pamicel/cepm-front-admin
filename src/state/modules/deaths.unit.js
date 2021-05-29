import * as deathsModule from './deaths'

describe('@state/modules/deaths', () => {
  it('exports a valid Vuex module', () => {
    expect(deathsModule).toBeAVuexModule()
  })
})
