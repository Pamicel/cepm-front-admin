import * as usersModule from './users'
import * as authModule from './auth'

describe('@state/modules/users', () => {
  let store
  beforeEach(async () => {
    store = createModuleStore({
      users: usersModule,
      auth: authModule,
    })
    window.localStorage.clear()
  })

  it('exports a valid Vuex module', () => {
    expect(usersModule).toBeAVuexModule()
  })

  it('userList starts as an empty array', () => {
    expect(store.state.users.userList).toEqual([])
  })

  it('cached starts as an empty array', () => {
    expect(store.state.users.cached).toEqual([])
  })

  it('selectedUser starts null', () => {
    expect(store.state.users.selectedUser).toBeNull()
  })

  // Saving user list

  it('commit("users/SAVE_USERS", newUserList) replaces the userList', () => {
    const users = [{ id: 1 }, { id: 2 }, { id: 3 }]
    store.commit('users/SAVE_USERS', users)
    expect(store.state.users.userList).toEqual(users)
    const values = ['a', 1, { math: 'yeah' }]
    store.commit('users/SAVE_USERS', values)
    expect(store.state.users.userList).toEqual(values)
  })

  // Fetching users

  it('fetchingUsers starts false', () => {
    expect(store.state.users.fetchingUsers).toBe(false)
  })
  it('commit("users/START_FETCHING_USERS") sets fetchingUsers to true', () => {
    store.commit('users/START_FETCHING_USERS')
    expect(store.state.users.fetchingUsers).toBe(true)
  })
  it('commit("users/END_FETCHING_USERS") sets fetchingUsers to false', () => {
    store.commit('users/START_FETCHING_USERS')
    store.commit('users/END_FETCHING_USERS')
    expect(store.state.users.fetchingUsers).toBe(false)
  })
  // it('dispatch("users/fetchUsers") resolves to null when not logged in', async () => {
  //   const users = await store.dispatch('users/fetchUsers')
  //   expect(users).toEqual(null)
  // })
  // it('dispatch("users/fetchUsers") resolves to a list when logged in as admin', async () => {
  //   await logInAsAdmin(store)
  //   const users = await store.dispatch('users/fetchUsers')
  //   expect(users instanceof Array).toBe(true)
  // })
  // it('dispatch("users/fetchUsers") updates userList when user logged in as director', async () => {
  //   await logInAsAdmin(store)
  //   const users = await store.dispatch('users/fetchUsers')
  //   const sortedUsers = [...users].sort((a, b) => a.id < b.id)
  //   const sortedStoreUsers = [...store.state.users.userList].sort(
  //     (a, b) => a.id < b.id
  //   )

  //   expect(sortedUsers).toEqual(sortedStoreUsers)
  // })

  // it('dispatch("users/fetchSingleUser", {userId}) resolves to null if not logged in', async () => {
  //   const response = await store.dispatch('users/fetchSingleUser', {
  //     userId: 1,
  //   })
  //   expect(response).toEqual(null)
  // })
  // it('dispatch("users/fetchSingleUser", { userId }) resolves with user if logged in and user exists', async () => {
  //   await logInAsAdmin(store)

  //   // Create the user
  //   const creationResponse = await store.dispatch('users/createUser', validUser)

  //   // fetch single user
  //   const user = await store.dispatch('users/fetchSingleUser', {
  //     userId: creationResponse.id,
  //   })
  //   expect(creationResponse.id).toEqual(user.id)

  //   // Delete user
  //   const deleteResponse = await store.dispatch('users/deleteUser', {
  //     userId: user.id,
  //   })
  //   // Add test for delete just in case, because it has not been tested at this point
  //   expect(deleteResponse).not.toBeNull()
  // })
  // it('dispatch("users/fetchSingleUser", { userId }) adds the user to state.cached', async () => {
  //   await logInAsAdmin(store)

  //   // Create the user
  //   const creationResponse = await store.dispatch('users/createUser', validUser)

  //   // fetch single user
  //   const user = await store.dispatch('users/fetchSingleUser', {
  //     userId: creationResponse.id,
  //   })
  //   const userInCache = store.state.users.cached.find((u) => u.id === user.id)
  //   expect(userInCache).toEqual(user)

  //   // Delete user
  //   const deleteResponse = await store.dispatch('users/deleteUser', {
  //     userId: user.id,
  //   })
  //   // Add test for delete just in case, because it has not been tested at this point
  //   expect(deleteResponse).not.toBeNull()
  // })
  // it('dispatch("users/fetchSingleUser", { userId }) updates the user in state.userList if and only if it was already in the list', async () => {
  //   await logInAsAdmin(store)

  //   const findUserInArray = (array, userId) =>
  //     array.find((u) => u.id === userId)
  //   const findUserInCache = (userId) =>
  //     findUserInArray(store.state.users.cached, userId)
  //   const findUserInList = (userId) =>
  //     findUserInArray(store.state.users.userList, userId)

  //   // Create the user
  //   const creationResponse = await store.dispatch('users/createUser', validUser)

  //   // fetch single user
  //   const user = await store.dispatch('users/fetchSingleUser', {
  //     userId: creationResponse.id,
  //   })
  //   expect(findUserInCache(user.id)).toEqual(user)
  //   // The user was not part of userList, so it still isn't
  //   expect(findUserInList(user.id)).not.toBeDefined()

  //   // Add only the user's id to the list
  //   store.commit('users/SAVE_USERS', [{ id: creationResponse.id }])
  //   // Check (just to be sure) that the version in the list is, in fact, incomplete
  //   expect(findUserInList(user.id)).not.toEqual(user)

  //   // Fetch single user again
  //   await store.dispatch('users/fetchSingleUser', {
  //     userId: creationResponse.id,
  //   })

  //   // This time the user was part of the userList and so it was updated
  //   expect(findUserInList(user.id)).toEqual(user)

  //   // Delete user
  //   const deleteResponse = await store.dispatch('users/deleteUser', {
  //     userId: user.id,
  //   })
  //   // Add test for delete just in case, because it has not been tested at this point
  //   expect(deleteResponse).not.toBeNull()
  // })

  // Creating user

  it('creatingUser starts false', () => {
    expect(store.state.users.creatingUser).toBe(false)
  })
  it('commit("users/START_CREATING_USER") sets creatingUser to true', () => {
    store.commit('users/START_CREATING_USER')
    expect(store.state.users.creatingUser).toBe(true)
  })
  it('commit("users/END_CREATING_USER") sets creatingUser to false', () => {
    store.commit('users/START_CREATING_USER')
    store.commit('users/END_CREATING_USER')
    expect(store.state.users.creatingUser).toBe(false)
  })
  // it('dispatch("users/createUser") resolves to null when not logged in', async () => {
  //   const users = await store.dispatch('users/createUser')
  //   expect(users).toEqual(null)
  // })
  // it('dispatch("users/createUser") resolves to a user when logged in as admin and dispatch("users/deleteUser") successfully deletes that user', async () => {
  //   await logInAsAdmin(store)

  //   // Create the user
  //   const creationResponse = await store.dispatch('users/createUser', validUser)
  //   expect(creationResponse.id).toBeDefined()

  //   // User does exist on server
  //   const fetchAfterCreateResponse = await store.dispatch(
  //     'users/fetchSingleUser',
  //     { userId: creationResponse.id }
  //   )
  //   expect(fetchAfterCreateResponse).toBeDefined()

  //   // User is in cache
  //   expect(
  //     store.state.users.cached.find((user) => user.id === creationResponse.id)
  //   ).toBeDefined()

  //   // Delete the user
  //   const deletionResponse = await store.dispatch('users/deleteUser', {
  //     userId: creationResponse.id,
  //   })
  //   expect(deletionResponse).toBe(true)

  //   // User does not exist anymore on server
  //   const fetchAfterDeleteResponse = await store.dispatch(
  //     'users/fetchSingleUser',
  //     { userId: creationResponse.id }
  //   )
  //   expect(fetchAfterDeleteResponse).toBeNull()

  //   // User not in cache anymore
  //   expect(
  //     store.state.users.cached.find((user) => user.id === creationResponse.id)
  //   ).not.toBeDefined()
  // })

  // Updating user

  it('commit("users/UPDATE_USER", { userId, update }) modifies a user in the userList if the user exists', () => {
    const users = [{ id: 1, role: 'abc', other: 'other value' }]

    const newRole = '098765'

    store.commit('users/SAVE_USERS', users)
    store.commit('users/UPDATE_USER', {
      ...users[0],
      role: newRole,
    })
    expect(store.state.users.userList[0].role).toEqual(newRole)
    expect(store.state.users.userList[0].other).toEqual(users[0].other)
  })

  it('commit("users/UPDATE_USER", { userId, update }) modifies a user in the cache if the user exists', () => {
    const user = { id: 1, role: 'abc', other: 'other value' }

    const newRole = '098765'

    store.commit('users/CACHE_USER', user)
    store.commit('users/UPDATE_USER', {
      ...user,
      role: newRole,
    })
    expect(store.state.users.cached[0].role).toEqual(newRole)
    expect(store.state.users.cached[0].other).toEqual(user.other)
  })

  // Updating role

  it('updatingRoles starts as an empty array', () => {
    expect(store.state.users.updatingRoles).toEqual([])
  })

  it('commit("users/START_UPDATING_USER_ROLE", userId) adds the userId to the updatingRoles array', () => {
    const userId = 123

    store.commit('users/START_UPDATING_USER_ROLE', userId)
    expect(store.state.users.updatingRoles).toEqual([userId])

    // Calling START_UPDATING_USER_ROLE twice on the same userId is not defined
    //    further than "the user id should still be present in the list"
    store.commit('users/START_UPDATING_USER_ROLE', userId)
    expect(store.state.users.updatingRoles).toContain(userId)
  })

  it('commit("users/END_UPDATING_USER_ROLE", userId) removes the userId to the updatingRoles array if present', () => {
    const firstUserId = 234
    const secondUserId = 345

    // Add first user id maybe multiple times
    store.commit('users/START_UPDATING_USER_ROLE', firstUserId)
    store.commit('users/START_UPDATING_USER_ROLE', firstUserId)
    store.commit('users/START_UPDATING_USER_ROLE', firstUserId)

    // Add second user id maybe multiple times
    store.commit('users/START_UPDATING_USER_ROLE', secondUserId)
    store.commit('users/START_UPDATING_USER_ROLE', secondUserId)
    store.commit('users/START_UPDATING_USER_ROLE', secondUserId)

    // Remove first user id once
    store.commit('users/END_UPDATING_USER_ROLE', firstUserId)

    // First user id should disapear
    expect(store.state.users.updatingRoles).not.toContain(firstUserId)
    // Second user id should remain
    expect(store.state.users.updatingRoles).toContain(secondUserId)
  })

  // it('dispatch("users/updateUserRole", { userId, role }) resolves to null when not logged in', async () => {
  //   const response = await store.dispatch('users/updateUserRole', {
  //     userId: 1,
  //     role: 'whatever',
  //   })
  //   expect(response).toBeNull()
  // })

  // it('dispatch("users/updateUserRole", { userId, role }) resolves to a user when logged in as admin', async () => {
  //   let userInList
  //   let userInCache

  //   await logInAsAdmin(store)
  //   const validRole = 'director'
  //   const user = await store.dispatch('users/createUser', validUser)

  //   await store.dispatch('users/fetchUsers')
  //   await store.dispatch('users/fetchSingleUser', { userId: user.id })

  //   userInList = store.state.users.userList.find((u) => u.id === user.id)
  //   userInCache = store.state.users.cached.find((u) => u.id === user.id)
  //   expect(userInList.auth.role).not.toBeDefined()
  //   expect(userInCache.auth.role).not.toBeDefined()

  //   const response = await store.dispatch('users/updateUserRole', {
  //     userId: user.id,
  //     role: validRole,
  //   })
  //   expect(response).toBe(true)

  //   // await store.dispatch('users/fetchUsers')
  //   await store.dispatch('users/fetchSingleUser', { userId: user.id })

  //   // Update values of userInCache and userInList
  //   userInList = store.state.users.userList.find((u) => u.id === user.id)
  //   userInCache = store.state.users.cached.find((u) => u.id === user.id)
  //   expect(userInList.auth.role).toBe(validRole)
  //   expect(userInCache.auth.role).toBe(validRole)

  //   // Delete user
  //   await store.dispatch('users/deleteUser', {
  //     userId: user.id,
  //   })
  // })

  // Selecting user

  it('commit("users/SELECT_USER", user) sets the value of selectedUser', () => {
    const object = { key: 'value' }

    store.commit('users/SELECT_USER', object)
    expect(store.state.users.selectedUser).toEqual(object)
  })

  // it('dispatch("users/selectUser", userId) selects the user if it is in memory', () => {
  //   const users = [
  //     {
  //       id: 1,
  //     },
  //     {
  //       id: 2,
  //     },
  //   ]

  //   store.commit('users/SAVE_USERS', users)
  //   store.dispatch('users/selectUser', { userId: users[0].id })
  //   expect(store.state.users.selectedUser).toEqual(users[0])
  // })

  // it('dispatch("users/selectUser", userId) sets selectedUser to null if the user is not in memory', () => {
  //   const users = [
  //     {
  //       id: 1,
  //     },
  //     {
  //       id: 2,
  //     },
  //   ]

  //   store.dispatch('users/selectUser', { userId: users[0].id })
  //   expect(store.state.users.selectedUser).toBeNull()
  // })
})

// const validUser = {
//   email: 'email@email.com',
//   password: '000000000',
// }

// async function logInAsAdmin(store) {
//   const adminUser = {
//     email: 'admin@te.st',
//     password: '000000000',
//   }
//   return await store.dispatch('auth/logIn', adminUser)
// }
