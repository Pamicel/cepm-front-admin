<script>
import Layout from '@layouts/local.vue'
import CrossingsTable from '@components/crossings-table.vue'
import { mapState } from 'vuex'

export default {
  page: {
    title: 'Traversées',
    meta: [{ name: 'description', content: 'Toutes les traversées.' }],
  },
  components: { Layout, CrossingsTable },
  computed: {
    ...mapState(['performances']),
  },
  mounted() {
    this.$store.dispatch('performances/fetchList')
  },
}
</script>

<template>
  <Layout>
    <div :class="$style.container">
      <CrossingsTable
        :performances="performances.list"
        :is-loading="performances.loading"
      />
    </div>
  </Layout>
</template>

<style lang="scss" module>
@import '@design';
</style>
