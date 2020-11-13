import VueMoment from 'vue-moment'
import Buefy from 'buefy'
import { createLocalVue } from '@vue/test-utils'
import CrossingCreationForm from './crossing-creation-form'

const localVue = createLocalVue()
localVue.use(VueMoment)
localVue.use(Buefy)

describe('@components/crossing-creation-form', () => {
  it('exports a valid component', () => {
    expect(CrossingCreationForm).toBeAComponent()
  })

  it('parses string audienceSize into number before sending', () => {
    const wrapper = mount(CrossingCreationForm, { localVue })

    const audienceSize = '30'
    wrapper.setData({ audienceSize })
    wrapper.vm.send()
    expect(wrapper.emitted().send[0][0].audienceSize).toEqual(
      parseInt(audienceSize)
    )
  })

  it('handles number audienceSize as well as string audienceSize', () => {
    const wrapper = mount(CrossingCreationForm, { localVue })

    const audienceSize = 30
    wrapper.setData({ audienceSize })
    wrapper.vm.send()
    expect(wrapper.emitted().send[0][0].audienceSize).toEqual(
      parseInt(audienceSize)
    )
  })
})
