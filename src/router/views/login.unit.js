import Login from './login.vue'

describe('@views/login', () => {
  it('is a valid view', () => {
    expect(Login).toBeAViewComponent()
  })

  it('redirects to home after successful login', () => {
    const { vm } = mountLogin()

    vm.email = 'correctEmail'
    vm.password = 'correctPassword'

    const routerPush = jest.fn()
    vm.$router = { push: routerPush }
    vm.$route = { query: {} }

    expect.assertions(2)
    return vm.tryToLogIn().then(() => {
      expect(vm.authError).toEqual(null)
      expect(routerPush).toHaveBeenCalledWith({ name: 'home' })
    })
  })

  it('sets authError after failed login', () => {
    const { vm } = mountLogin()

    vm.email = 'correctEmail'
    vm.password = '%%%incorrectPwd%%%'

    expect.assertions(1)
    return vm.tryToLogIn().then(() => {
      expect(vm.authError).not.toBeFalsy()
    })
  })

  it('redirects to redirectFrom query, if it exists, after successful login', () => {
    const { vm } = mountLogin()

    vm.email = 'correctEmail'
    vm.password = 'correctPassword'

    const routerPush = jest.fn()
    vm.$router = { push: routerPush }

    const redirectFrom = '/profile?someQuery'
    vm.$route = { query: { redirectFrom } }

    expect.assertions(2)
    return vm.tryToLogIn().then(() => {
      expect(vm.authError).toEqual(null)
      expect(routerPush).toHaveBeenCalledWith(redirectFrom)
    })
  })
})

function mountLogin() {
  return shallowMountView(Login, {
    ...createComponentMocks({
      store: {
        auth: {
          actions: {
            logIn(_, { email, password }) {
              if (email === 'correctEmail' && password === 'correctPassword') {
                return Promise.resolve('testToken')
              } else {
                return Promise.reject(new Error('testError'))
              }
            },
          },
        },
      },
    }),
  })
}
