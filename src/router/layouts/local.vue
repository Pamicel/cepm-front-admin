<template>
  <div :class="$style.container">
    <slot />
  </div>
</template>

<style lang="scss" module>
@import '@design';

.container {
  min-width: $size-content-width-min;
  margin: 0 auto;
}
</style>
