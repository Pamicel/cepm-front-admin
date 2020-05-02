<script>
import NavBar from '@components/nav-bar.vue'
import Footer from '@components/footer.vue'

export default {
  components: { NavBar, Footer },
}
</script>

<template>
  <div :class="$style.container">
    <NavBar />
    <div :class="$style.content">
      <slot />
    </div>
    <Footer :class="$style.footer" />
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
  .content {
    flex: 1 0 auto;
  }
  .footer {
    flex-shrink: 0;
  }
}
</style>
