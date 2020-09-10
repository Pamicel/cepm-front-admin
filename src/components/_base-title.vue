<template>
  <h1 :class="$style.title"><slot /></h1>
</template>

<style lang="scss" module>
@import '@design';
.title {
  padding: 0 1rem;
  line-height: 1.2em;
}
</style>
