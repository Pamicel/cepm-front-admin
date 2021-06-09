<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    formOpen: {
      type: Boolean,
      required: true,
    },
  },
}
</script>

<template>
  <div :class="[$style.creation, formOpen ? $style.creationOpen : '']">
    <b-collapse
      :open="formOpen"
      @open="$emit('update:formOpen', true)"
      @close="$emit('update:formOpen', false)"
    >
      <BaseButton
        slot="trigger"
        :class="[$style.createButton, formOpen ? $style.createButtonOpen : '']"
      >
        {{ title }}
      </BaseButton>
      <div :class="$style.creationFormContainer">
        <slot />
      </div>
    </b-collapse>
  </div>
</template>

<style lang="scss" module>
@import '@design';

.creation {
  width: 100%;
  transition: all 200ms;
  .creationForm {
    width: fit-content;
  }
  &.creationOpen {
    @include box_shadow(1);
    @extend %comic-box;

    padding: 1rem;
    margin: 0 0 1rem 0;
  }

  .createButton {
    @extend %typography-medium;

    padding: 0;
    margin: 0 0 1rem;
    background-color: transparent;
    border-bottom: 0.1em solid transparent;
    transition: all 100ms;
    &:hover {
      border-color: black;
    }
    &.createButtonOpen {
      @extend %typography-large;
    }
  }
}
</style>
