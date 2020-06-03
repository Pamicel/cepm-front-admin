<script>
import Layout from '@layouts/local.vue'
import { mapGetters } from 'vuex'

export default {
  page: {
    title: 'Panneau de traversée',
    meta: [{ name: 'description', content: 'The Crossing Details page.' }],
  },
  components: { Layout },
  computed: {
    ...mapGetters({
      crossing: 'performances/getCurrent',
    }),
  },
  mounted() {
    this.$store.dispatch('performances/fetchPerf', {
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
    </div>
  </Layout>
</template>

<style lang="scss" module>
@import '@design';
</style>
