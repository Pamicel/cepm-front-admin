<script>
export default {
  props: {
    icon: {
      type: String,
      default: '',
    },
    loading: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<template>
  <button
    :class="$style.actionsButton"
    :disabled="loading || disabled"
    @click="$emit('click')"
  >
    <BaseIcon
      v-if="loading"
      :class="$style.actionsButtonIcon"
      name="fan"
      spin
    />
    <BaseIcon
      v-else-if="icon !== ''"
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

  position: relative;
  padding: 1rem;
  margin: 1rem;
  cursor: pointer;
  background: transparent;
  border: 0;
  border-radius: 8px;
  .actionsButtonIcon {
    margin-right: 0.5rem;
  }

  &:disabled {
    opacity: 0.5;
  }
}
</style>
