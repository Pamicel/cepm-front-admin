import Users from './users'

describe('@views/users', () => {
  it('is a valid view', () => {
    expect(Users).toBeAViewComponent()
  })
})
