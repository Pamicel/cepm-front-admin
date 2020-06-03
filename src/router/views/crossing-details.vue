<script>
import Layout from '@layouts/local.vue'
import SpectatorsTable from '@components/spectators-table.vue'
import { mapGetters, mapState } from 'vuex'

export default {
  page: {
    title: 'Panneau de traversée',
    meta: [{ name: 'description', content: 'The Crossing Details page.' }],
  },
  components: { Layout, SpectatorsTable },
  computed: {
    ...mapState(['spectators']),
    ...mapGetters({
      crossing: 'performances/getCurrent',
    }),
  },
  mounted() {
    this.$store.dispatch('performances/fetchOne', {
      perfId: this.$route.params.id,
    })
    this.$store.dispatch('spectators/fetchList', {
      perfId: this.$route.params.id,
    })
  },
}
</script>

<template>
  <Layout>
    <div :class="$style.container">
      <pre>
        {{ crossing }}
      </pre>
      <SpectatorsTable
        :spectators="spectators.list"
        :is-loading="spectators.loading"
      />
    </div>
  </Layout>
</template>

<style lang="scss" module>
@import '@design';
</style>
