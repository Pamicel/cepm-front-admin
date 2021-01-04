<script>
export default {
  props: {
    icon: {
      type: String,
      default: '',
    },
  },
}
</script>

<template>
  <button :class="$style.actionsButton" @click="$emit('click')">
    <BaseIcon
      v-if="icon !== ''"
      :name="icon"
      :class="$style.actionsButtonIcon"
    />
    <slot />
  </button>
</template>

<style lang="scss" module>
@import '@design';

.actionsButton {
  @include embossed_paper_shadow(2);
  @extend %typography-small;

  padding: 1rem;
  margin: 1rem;
  cursor: pointer;
  background: transparent;
  border: 0;
  border-radius: 8px;
  .actionsButtonIcon {
    margin-right: 0.5rem;
  }
}
</style>
