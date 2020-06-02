<template>
  <div :class="$style.container">
    <img src="@assets/images/logo-359-degres.jpg" alt="logo de l'application" />
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
