<script>
export default {}
</script>

<template>
  <div :class="$style.container">
    <h3>
      Remplissez votre FIRM dès maintenant
    </h3>
    <BaseButton :class="$style.button" @click="$router.push('demarches')">
      Remplir >
    </BaseButton>
  </div>
</template>

<style lang="scss" module>
@import '@design';

.container {
  padding: $size-grid-padding;
  padding-bottom: 3em;
  text-align: center;
  background-color: $color-c;

  .button {
    @extend %cta-button;
  }
}
</style>
