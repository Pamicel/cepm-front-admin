import UserAdminPanel from './user-admin-panel.vue'

describe('@views/user-admin-panel', () => {
  it('is a valid view', () => {
    expect(UserAdminPanel).toBeAViewComponentUsing({
      user: { permissionLevel: 1 },
    })
  })
})
