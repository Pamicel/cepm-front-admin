<script>
import { mapGetters, mapState } from 'vuex'
import NavBarRoutes from './nav-bar-routes.vue'

export default {
  components: { NavBarRoutes },
  data() {
    return {
      persistentRoutes: [
        {
          name: 'home',
          title: 'Accueil',
        },
        {
          name: 'histoire',
          title: 'À propos',
        },
      ],
      loggedInRoutes: {
        adminsOnly: [
          {
            name: 'users',
            title: 'Utilisateurs',
          },
        ],
        directorsOnly: [
          {
            name: 'traversees',
            title: 'Traversées',
          },
        ],
        account: [
          {
            name: 'profile',
            title: 'Mon compte',
          },
          {
            name: 'logout',
            title: 'Se déconnecter',
          },
        ],
      },
      loggedOutRoutes: [
        {
          name: 'login',
          title: 'Se connecter',
        },
      ],
    }
  },
  computed: {
    ...mapGetters({
      loggedIn: 'auth/loggedIn',
    }),
    ...mapState({
      currentUser: (state) => state.auth.currentUser,
    }),
    isAdmin() {
      return this.currentUser.auth && this.currentUser.auth.role === 'admin'
    },
    isDirector() {
      return this.currentUser.auth && this.currentUser.auth.role === 'director'
    },
  },
}
</script>

<template>
  <ul :class="$style.container">
    <NavBarRoutes :routes="persistentRoutes" />
    <span v-if="loggedIn">
      <NavBarRoutes v-if="isAdmin" :routes="loggedInRoutes.adminsOnly" />
      <NavBarRoutes v-if="isDirector" :routes="loggedInRoutes.directorsOnly" />
      <NavBarRoutes :routes="loggedInRoutes.account" />
    </span>
    <NavBarRoutes v-else :routes="loggedOutRoutes" />
  </ul>
</template>

<style lang="scss" module>
@import '@design';

.container {
  @extend %typography-medium;

  height: $size-footer-height;
  padding: $size-grid-padding;
  margin: 0;
  text-align: right;
  list-style-type: none;
}
</style>
