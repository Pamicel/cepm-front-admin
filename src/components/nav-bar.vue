<script>
import { authComputed } from '@state/helpers'
import NavBarRoutes from './nav-bar-routes.vue'

export default {
  components: { NavBarRoutes },
  data() {
    return {
      persistentNavRoutes: [
        {
          name: 'home',
          title: 'Accueil',
        },
        {
          name: 'histoire',
          title: 'À propos',
        },
      ],
      loggedInNavRoutes: [
        {
          name: 'traversees',
          title: 'Réservations',
        },
        {
          name: 'profile',
          title: 'Mon compte',
        },
        {
          name: 'logout',
          title: 'Se déconnecter',
        },
      ],
      loggedOutNavRoutes: [
        {
          name: 'login',
          title: 'Se connecter',
        },
      ],
    }
  },
  computed: {
    ...authComputed,
  },
}
</script>

<template>
  <ul :class="$style.container">
    <NavBarRoutes :routes="persistentNavRoutes" />
    <NavBarRoutes v-if="loggedIn" :routes="loggedInNavRoutes" />
    <NavBarRoutes v-else :routes="loggedOutNavRoutes" />
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

  > li {
    display: inline-block;
    margin-right: $size-grid-padding;
  }
}
</style>
