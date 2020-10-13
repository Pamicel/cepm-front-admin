<script>
import NavBar from '@components/nav-bar.vue'
import Footer from '@components/footer.vue'

export default {
  components: { NavBar, Footer },
  props: {
    narrow: {
      type: Boolean,
      default: false,
    },
    padded: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<template>
  <div :class="$style.container">
    <NavBar :id="$style.navBar" />
    <div :class="$style.logo">
      <BaseLink name="home">
        <img
          src="@assets/images/target.svg"
          :class="$style.logoCalmes"
          aria-label="Accueil"
        />
      </BaseLink>
    </div>
    <div :class="$style.contentAndFooter">
      <div
        :class="[
          $style.content,
          narrow ? $style.narrow : '',
          padded ? $style.padded : '',
        ]"
      >
        <slot />
      </div>
      <slot name="footer-extension" />
      <Footer :id="$style.footer" />
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@design';

.container {
  .logo {
    position: absolute;
    top: $size-grid-padding;
    left: $size-grid-padding;
    .logoCalmes {
      height: 3rem;
    }
    .logoRepublique {
      margin-right: $size-grid-padding;
    }
  }

  display: flex;
  flex-direction: column;
  min-width: $size-content-width-min;
  max-width: 100%;
  max-height: 100%;
  margin: 0 auto;

  #navBar {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
  }

  .contentAndFooter {
    display: flex;
    flex: 1 0 auto;
    flex-direction: column;
    max-height: 100%;
    padding-top: $size-header-height * 2;
    overflow: auto;
    .content {
      flex: 1 0 auto;
      &.padded {
        padding-bottom: $size-grid-padding;
      }
      &.narrow {
        min-width: $size-content-width-min;
        max-width: $size-content-width-max;
        margin: auto;
      }
    }
    #footer {
      flex-shrink: 0;
      background-color: $color-body-bg;
    }
  }
}
</style>
