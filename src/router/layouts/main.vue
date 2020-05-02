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
    <div
      :class="[
        $style.content,
        narrow ? $style.narrow : '',
        padded ? $style.padded : '',
      ]"
    >
      <slot />
    </div>
    <Footer :id="$style.footer" />
  </div>
</template>

<style lang="scss" module>
@import '@design';

.container {
  display: flex;
  flex-direction: column;
  min-width: $size-content-width-min;
  max-width: 100%;
  min-height: 100%;
  margin: 0 auto;
  background-color: $color-content-bg;
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
  }
  #navBar,
  #footer {
    background-color: $color-body-bg;
  }
}
</style>
