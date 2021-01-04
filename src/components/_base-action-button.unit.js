import BaseActionButton from './_base-action-button'

describe('@components/_base-action-button', () => {
  it('exports a valid component', () => {
    expect(BaseActionButton).toBeAComponent()
  })

  it('button is clicked, "click" is emitted', () => {
    const wrapper = shallowMount(BaseActionButton)
    wrapper.find('button').element.click()
    expect(wrapper.emitted().click).toBeDefined()
  })

  it('when :disabled="true", button is disabled', () => {
    const wrapper = shallowMount(BaseActionButton, {
      propsData: { disabled: true },
    })
    const button = wrapper.find('button').element
    expect(button.disabled).toBe(true)
  })

  it('when :loading="true", button is disabled', () => {
    const wrapper = shallowMount(BaseActionButton, {
      propsData: { loading: true },
    })
    const button = wrapper.find('button').element
    expect(button.disabled).toBe(true)
  })
})
