import store from '@state/store'
import { PERMISSION_LEVELS } from '@state/modules/auth'

export default [
  {
    path: '/',
    name: 'home',
    component: () => lazyLoadView(import('@views/home.vue')),
  },
  {
    path: '/login',
    name: 'login',
    component: () => lazyLoadView(import('@views/login.vue')),
    meta: {
      beforeResolve(routeTo, routeFrom, next) {
        // If the user is already logged in
        if (store.getters['auth/loggedIn']) {
          // Redirect to the home page instead
          next({
            name: 'home',
          })
        } else {
          // Continue to the login page
          next()
        }
      },
    },
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => lazyLoadView(import('@views/profile.vue')),
    meta: {
      authRequired: true,
    },
    props: (route) => ({
      user: store.state.auth.currentUser || {},
    }),
  },
  {
    path: '/traversees',
    name: 'crossings',
    component: () => lazyLoadView(import('@views/crossings.vue')),
    meta: {
      authRequired: true,
      requiredPermissions: [PERMISSION_LEVELS.DIRECTOR],
    },
  },
  {
    path: '/sqda',
    name: 'sqda',
    component: () => lazyLoadView(import('@views/sqda-questions.vue')),
    meta: {
      authRequired: true,
      requiredPermissions: [PERMISSION_LEVELS.DIRECTOR],
    },
  },
  {
    path: '/traversees/:id',
    redirect: { name: 'deaths' },
    name: 'crossing-details',
    // component: () => lazyLoadView(import('@views/crossing-details.vue')),
    // meta: {
    //   authRequired: true,
    //   requiredPermissions: [PERMISSION_LEVELS.DIRECTOR],
    // },
  },
  {
    path: '/traversees/:id/reservations',
    name: 'bookings',
    component: () => lazyLoadView(import('@views/bookings.vue')),
    meta: {
      authRequired: true,
      requiredPermissions: [PERMISSION_LEVELS.DIRECTOR],
    },
  },
  {
    path: '/traversees/:id/morts',
    name: 'deaths',
    component: () => lazyLoadView(import('@views/deaths.vue')),
    meta: {
      authRequired: true,
      requiredPermissions: [PERMISSION_LEVELS.DIRECTOR],
    },
  },
  {
    path: '/traversees/:id/upload',
    name: 'bookings-upload',
    meta: {
      authRequired: true,
      requiredPermissions: [PERMISSION_LEVELS.DIRECTOR],
    },
    component: () => lazyLoadView(import('@views/bookings-upload.vue')),
  },
  {
    path: '/users/:id',
    name: 'single-user',
    component: () => lazyLoadView(import('@views/user-admin-panel.vue')),
    meta: {
      authRequired: true,
      requiredPermissions: [PERMISSION_LEVELS.ADMIN],
      // HACK: In order to share data between the `beforeResolve` hook
      // and the `props` function, we must create an object for temporary
      // data only used during route resolution.
      tmp: {},
      async beforeResolve(routeTo, _, next) {
        try {
          // Try to fetch the user's information by their id
          await store.dispatch('users/fetchSingleUser', {
            userId: routeTo.params.id,
          })
          await store.dispatch('users/selectUser', {
            userId: routeTo.params.id,
          })
          // Continue to the route.
          next()
        } catch (error) {
          // If a user with the provided id could not be
          // found, redirect to the 404 page.
          next({
            name: '404',
            params: {
              resource: 'User',
            },
          })
        }
      },
    },
    // Set the user from the route params, once it's set in the
    // beforeResolve route guard.
    props: (route) => ({
      user: route.meta.tmp.user,
    }),
  },
  {
    path: '/users',
    name: 'users',
    component: () => lazyLoadView(import('@views/users.vue')),
    meta: {
      authRequired: true,
      requiredPermissions: [PERMISSION_LEVELS.ADMIN],
    },
  },
  {
    path: '/logout',
    name: 'logout',
    meta: {
      beforeResolve(_, routeFrom, next) {
        store.dispatch('auth/logOut')
        const authRequiredOnPreviousRoute = routeFrom.matched.some(
          (route) => route.meta.authRequired
        )
        // Navigate back to previous page, or home as a fallback
        next(
          authRequiredOnPreviousRoute
            ? {
                name: 'home',
              }
            : {
                ...routeFrom,
              }
        )
      },
    },
  },
  {
    path: '/404',
    name: '404',
    component: require('@views/_404.vue').default,
    // Allows props to be passed to the 404 page through route
    // params, such as `resource` to define what wasn't found.
    props: true,
  },
  // Redirect any unmatched routes to the 404 page. This may
  // require some server configuration to work in production:
  // https://router.vuejs.org/en/essentials/history-mode.html#example-server-configurations
  {
    path: '*',
    redirect: '404',
  },
]

// Lazy-loads view components, but with better UX. A loading view
// will be used if the component takes a while to load, falling
// back to a timeout view in case the page fails to load. You can
// use this component to lazy-load a route with:
//
// component: () => lazyLoadView(import('@views/my-view'))
//
// NOTE: Components loaded with this strategy DO NOT have access
// to in-component guards, such as beforeRouteEnter,
// beforeRouteUpdate, and beforeRouteLeave. You must either use
// route-level guards instead or lazy-load the component directly:
//
// component: () => import('@views/my-view')
//
function lazyLoadView(AsyncView) {
  const AsyncHandler = () => ({
    component: AsyncView,
    // A component to use while the component is loading.
    loading: require('@views/_loading.vue').default,
    // Delay before showing the loading component.
    // Default: 200 (milliseconds).
    delay: 400,
    // A fallback component in case the timeout is exceeded
    // when loading the component.
    error: require('@views/_timeout.vue').default,
    // Time before giving up trying to load the component.
    // Default: Infinity (milliseconds).
    timeout: 10000,
  })

  return Promise.resolve({
    functional: true,
    render(h, { data, children }) {
      // Transparently pass any props or children
      // to the view component.
      return h(AsyncHandler, data, children)
    },
  })
}
