<script>
export default {
  props: {
    to: {
      type: String,
      required: true,
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
        type="is-link"
        size="is-medium"
        :outlined="$route.name !== to"
        @click="$emit('use')"
        ><slot
      /></b-button>
    </BaseLink>
  </div>
</template>

<style lang="scss" module>
@import '@design';
</style>
