<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main.vue'
import { mapGetters } from 'vuex'

export default {
  page: {
    // All subcomponent titles will be injected into this template.
    titleTemplate(title) {
      title = typeof title === 'function' ? title(this.$store) : title
      return title ? `${title} | ${appConfig.title}` : appConfig.title
    },
  },
  components: { Layout },
  computed: {
    ...mapGetters({
      loggedIn: 'auth/loggedIn',
    }),
  },
  watch: {
    loggedIn(newValue, oldValue) {
      if (oldValue === true && newValue === false) {
        this.$buefy.toast.open({
          type: 'is-danger',
          message: 'Vous avez été déconnecté·e',
        })
      }
    },
  },
}
</script>

<template>
  <Layout id="app">
    <!--
    Even when routes use the same component, treat them
    as distinct and create the component again.
    -->
    <RouterView :key="$route.fullPath" />
  </Layout>
</template>

<!-- This should generally be the only global CSS in the app. -->
<style lang="scss">
// Overwrite Buefy style
// 1. Import Bulma's core
@import '~bulma/sass/utilities/_all';
// 2. Set colors
@import 'design/_colors';
$primary: $color-c;
// 3. Import Bulma and Buefy styles
@import '~bulma';
@import '~buefy/src/scss/buefy';

// Allow element/type selectors, because this is global CSS.
// stylelint-disable selector-max-type, selector-class-pattern

// Normalize default styles across browsers,
// https://necolas.github.io/normalize.css/
@import '~normalize.css/normalize.css';
// Style loading bar between pages.
// https://github.com/rstacruz/nprogress
@import '~nprogress/nprogress.css';

// Design variables and utilities from src/design.
@import '@design';

*,
*::before,
*::after {
  box-sizing: border-box;
}

html,
body,
#app {
  height: 100%;
}

#app {
  @extend %typography-small;

  overflow: hidden;
  background-color: $color-body-bg;
}

// ===
// Base element styles
// ===

a,
a:visited {
  color: $color-link-text;
}

h1 {
  @extend %typography-xlarge;
}

h2 {
  @extend %typography-xlarge;
}

h3 {
  @extend %typography-large;
}

h4 {
  @extend %typography-medium;
}

h5,
h6 {
  @extend %typography-small;
}

// ===
// Vendor
// ===

#nprogress .bar {
  background: $color-link-text;
}

// ===
// Transitions
// ===

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.slide-fade-enter-active {
  transition: all 0.1s ease;
}
.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(10px);
}

.rotate-fade-enter-active {
  transition: all 0.1s ease;
}
.rotate-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}
.rotate-fade-enter
/* .rotate-fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: rotate(45deg);
}
.rotate-fade-leave-to
/* .rotate-fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: rotate(-45deg);
}
</style>
