<template>
  <div :class="$style.container">
    <img src="@assets/images/logo-cepm.png" alt="logo du cepm" />
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" module>
@import '@design';

.container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: $size-header-height;
  img {
    height: 60%;
  }
}
</style>
