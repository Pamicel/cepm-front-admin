import Profile from './profile.vue'

describe('@views/profile', () => {
  it('is a valid view', () => {
    expect(Profile).toBeAViewComponentUsing({ user: { permissionLevel: 1 } })
  })
})
