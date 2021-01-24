<template>
  <div :class="$style.container">
    <img src="@assets/images/cepm-logo-normal-small.svg" alt="logo du CEPM" />
  </div>
</template>

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
