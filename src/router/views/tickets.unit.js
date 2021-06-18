import Tickets from './tickets'

describe('@views/tickets', () => {
  it('is a valid view', () => {
    expect(Tickets).toBeAViewComponent()
  })
})
