import * as crossingsModule from './crossings'

describe('@state/modules/crossings', () => {
  it('exports a valid Vuex module', () => {
    expect(crossingsModule).toBeAVuexModule()
  })
})
