<script>
export default {
  props: {
    isOk: {
      type: Boolean,
      required: true,
    },
  },
}
</script>

<template>
  <p v-if="isOk" data-state="ok"
    ><slot name="ok"></slot>&nbsp;<BaseIcon :class="$style.iconOk" name="check"
  /></p>
  <p v-else data-state="not-ok"
    ><slot name="not-ok"></slot>&nbsp;<BaseIcon
      :class="$style.iconDanger"
      name="times"
  /></p>
</template>

<style lang="scss" module>
@import '@design';

.iconOk {
  color: $color-success;
}
.iconDanger {
  color: $color-danger;
}
</style>
