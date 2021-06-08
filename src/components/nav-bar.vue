<script>
import { mapGetters, mapState } from 'vuex'
import NavBarRoute from '@components/nav-bar-route.vue'

export default {
  components: { NavBarRoute },
  data() {
    return {
      navOpen: false,
      loggedInRoutes: {
        directorsOnly: [
          {
            name: 'crossings',
            title: 'Traversées',
          },
          {
            name: 'sqda',
            title: 'SQDA',
          },
        ],
        account: [
          {
            name: 'profile',
            title: 'Mon compte',
          },
        ],
      },
      scrollPosition: 0,
    }
  },
  computed: {
    ...mapGetters({
      loggedIn: 'auth/loggedIn',
      isAdmin: 'auth/isAdmin',
      isDirector: 'auth/isDirector',
    }),
    ...mapState({
      currentUser: (state) => state.auth.currentUser,
    }),
  },
  methods: {
    logout() {
      this.close()
      this.$router.push({ name: 'logout' })
    },
    close() {
      this.navOpen = false
    },
    open() {
      this.navOpen = true
    },
  },
}
</script>

<template>
  <div :class="$style.container">
    <div v-if="loggedIn"><b-button rounded @click="open">Menu</b-button></div>

    <b-sidebar fullheight :open="navOpen" right @close="close">
      <div :class="$style.sidebarContent">
        <div :class="$style.menu">
          <div :class="$style.closeButton">
            <b-button rounded @click="close">Fermer</b-button>
          </div>
          <div :class="$style.routes">
            <NavBarRoute
              v-if="isAdmin"
              :class="$style.navroute"
              to="users"
              @use="close"
              >Utilisateurs</NavBarRoute
            >
            <NavBarRoute
              v-if="isDirector"
              :class="$style.navroute"
              to="crossings"
              @use="close"
              >Traversées</NavBarRoute
            >
            <NavBarRoute
              v-if="isDirector"
              :class="$style.navroute"
              to="sqda"
              @use="close"
              >S.Q.D.A.</NavBarRoute
            >
            <NavBarRoute :class="$style.navroute" to="profile" @use="close"
              >Mon compte</NavBarRoute
            >
          </div>
        </div>
        <div :class="$style.logoutButton">
          <b-button type="is-danger" rounded @click="logout"
            >Déconnexion</b-button
          >
        </div>
      </div>
    </b-sidebar>
  </div>
</template>

<style lang="scss" module>
@import '@design';

.container {
  @extend %typography-medium;

  z-index: $layer-page-z-index;
  height: $size-footer-height;
  padding: $size-grid-padding;
  margin: 0;
  text-align: right;
  list-style-type: none;
  background: linear-gradient(white, transparentize(white, 1));
}
.sidebarContent {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  padding: $size-grid-padding;
  .logoutButton {
    text-align: center;
  }
  .menu {
    display: flex;
    flex-direction: column;
    .logoutButton,
    .closeButton {
      text-align: right;
    }
    .closeButton {
      margin-bottom: 1rem;
    }
    .routes {
      @extend %typography-medium;

      text-align: right;
      .navroute {
        display: block;
        width: 100%;
        margin-top: 1em;
      }
    }
  }
}
</style>
