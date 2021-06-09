<script>
export default {
  props: {
    to: {
      type: String,
      required: true,
    },
    solid: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: 'is-link',
    },
  },
}
</script>

<template>
  <div>
    <BaseLink :name="to">
      <b-button
        rounded
        :class="$style.routeButton"
        :type="type"
        size="is-medium"
        :outlined="$route.name !== to && !solid"
        @click="$emit('use')"
        ><slot
      /></b-button>
    </BaseLink>
  </div>
</template>

<style lang="scss" module>
@import '@design';
</style>
