<script>
import Layout from '@layouts/local.vue'

export default {
  page: {
    title: 'Users',
    meta: [{ name: 'description', content: 'The Users page.' }],
  },
  components: { Layout },
}
</script>

<template>
  <Layout>
    <div :class="$style.container">
      Users
    </div>
  </Layout>
</template>

<style lang="scss" module>
@import '@design';
</style>
