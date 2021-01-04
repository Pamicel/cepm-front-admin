import BaseState from './_base-state'

describe('@components/_base-state', () => {
  it('exports a valid component', () => {
    expect(BaseState).toBeAComponent()
  })

  it('renders the correct state when isOk is true', () => {
    const wrapper = shallowMount(BaseState, { propsData: { isOk: true } })
    expect(wrapper.find('[data-state=ok]').element).toBeDefined()
    expect(wrapper.find('[data-state=not-ok]').element).not.toBeDefined()
  })

  it('renders the correct state when isOk is false', () => {
    const wrapper = shallowMount(BaseState, { propsData: { isOk: false } })
    expect(wrapper.find('[data-state=not-ok]').element).toBeDefined()
    expect(wrapper.find('[data-state=ok]').element).not.toBeDefined()
  })
})
