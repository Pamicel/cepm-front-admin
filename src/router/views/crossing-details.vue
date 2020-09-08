<script>
import Layout from '@layouts/local.vue'
import BookingsTable from '@components/bookings-table.vue'
import { mapState } from 'vuex'

export default {
  page: {
    title: 'Panneau de traversée',
    meta: [{ name: 'description', content: 'The Crossing Details page.' }],
  },
  components: { Layout, BookingsTable },
  computed: {
    ...mapState({
      fetchingCrossing: (state) => state.crossings.fetchingSingleCrossing,
      crossing: (state) => state.crossings.selectedCrossing,
      bookings: (state) => state.bookings,
    }),
  },
  mounted() {
    const crossingId = this.$route.params.id
    if (!this.crossing || this.crossing.id !== crossingId) {
      this.$store.dispatch('crossings/fetchSingleCrossing', crossingId)
    }
    this.$store.dispatch('bookings/fetchBookings', {
      crossingId,
    })
  },
}
</script>

<template>
  <Layout>
    <div :class="$style.container">
      <pre>
        {{ fetchingCrossing ? '...' : crossing }}
      </pre>
      <BookingsTable
        :bookings="bookings.bookingList"
        :is-loading="bookings.fetchingBookings"
      />
    </div>
  </Layout>
</template>

<style lang="scss" module>
@import '@design';
</style>
