import * as wsModule from './ws'

describe('@state/modules/ws', () => {
  it('exports a valid Vuex module', () => {
    expect(wsModule).toBeAVuexModule()
  })
})
