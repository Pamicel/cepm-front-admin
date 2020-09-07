<script>
import Layout from '@layouts/local.vue'
import BookingsTable from '@components/bookings-table.vue'
import { mapGetters, mapState } from 'vuex'

export default {
  page: {
    title: 'Panneau de traversée',
    meta: [{ name: 'description', content: 'The Crossing Details page.' }],
  },
  components: { Layout, BookingsTable },
  computed: {
    ...mapState(['bookings']),
    ...mapGetters({
      crossing: 'performances/getCurrent',
    }),
  },
  mounted() {
    this.$store.dispatch('performances/fetchOne', {
      perfId: this.$route.params.id,
    })
    this.$store.dispatch('bookings/fetchList', {
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
      <BookingsTable
        :bookings="bookings.bookingList"
        :is-loading="bookings.loading"
      />
    </div>
  </Layout>
</template>

<style lang="scss" module>
@import '@design';
</style>
