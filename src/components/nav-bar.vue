<script>
import { mapGetters } from 'vuex'
import NavBarRoute from '@components/nav-bar-route.vue'

export default {
  components: { NavBarRoute },
  data() {
    return {
      navOpen: false,
    }
  },
  computed: {
    ...mapGetters({
      loggedIn: 'auth/loggedIn',
      isAdmin: 'auth/isAdmin',
      isDirector: 'auth/isDirector',
    }),
  },
  methods: {
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
    <div v-if="loggedIn"
      ><b-button type="is-dark" rounded icon-right="bars" @click="open"
        >Menu</b-button
      ></div
    >

    <b-sidebar fullheight :open="navOpen" right @close="close">
      <div :class="$style.sidebarContent">
        <div :class="$style.menu">
          <div :class="$style.closeButton">
            <b-button
              type="is-dark"
              rounded
              icon-right="arrow-right"
              @click="close"
              >Fermer</b-button
            >
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
              to="director-users"
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
            <hr />
            <NavBarRoute
              :class="$style.navroute"
              to="logout"
              solid
              type="is-danger"
              @use="close"
              >Déconnexion</NavBarRoute
            >
          </div>
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
