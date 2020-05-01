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
      ],
      loggedInNavRoutes: [
        {
          name: 'profile',
          title: () => 'Logged in as ' + this.currentUser.name,
        },
        {
          name: 'logout',
          title: 'Log out',
        },
      ],
      loggedOutNavRoutes: [
        {
          name: 'login',
          title: 'Log in',
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
    <div :class="$style.logos">
      <img
        src="@assets/images/logo-republique-francaise.png"
        :class="$style.logoRepublique"
        aria-label="Publique-ré Çaise-fran"
      />
      <BaseLink name="home">
        <img
          src="@assets/images/logo-cepm.png"
          :class="$style.logoCEPM"
          aria-label="Accueil"
        />
      </BaseLink>
    </div>
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
  text-align: center;
  list-style-type: none;

  > li {
    display: inline-block;
    margin-right: $size-grid-padding;
  }

  .logos {
    position: absolute;
    top: $size-grid-padding;
    left: $size-grid-padding;
    .logoRepublique,
    .logoCEPM {
      height: 50px;
    }
    .logoRepublique {
      margin-right: $size-grid-padding;
    }
  }
}
</style>
