<script>
import Layout from '@layouts/local.vue'

export default {
  page: {
    title: '404',
    meta: [{ name: 'description', content: '404' }],
  },
  components: { Layout },
  props: {
    resource: {
      type: String,
      default: '',
    },
  },
}
</script>

<template>
  <Layout>
    <h1 :class="$style.title">
      404
      <template v-if="resource">{{ resource }}</template>
      Le serveur n'a pas trouvé la page/ressource demandée.
    </h1>
  </Layout>
</template>

<style lang="scss" module>
.title {
  text-align: center;
}
</style>
