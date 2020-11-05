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
  async mounted() {
    const crossingId = this.$route.params.id
    if (!this.crossing || this.crossing.id !== crossingId) {
      const crossing = await this.$store.dispatch(
        'crossings/fetchSingleCrossing',
        crossingId
      )
      if (crossing === null) {
        return this.$router.replace({ name: 'crossings' })
      }
    }

    this.$store.dispatch('bookings/fetchBookings', {
      crossingId,
    })
  },
  methods: {
    async goToUploadPage(file) {
      this.$router.push({ name: 'bookings-upload' })
    },
  },
}
</script>

<template>
  <Layout>
    <div :class="$style.container">
      <pre>
        {{ fetchingCrossing ? '...' : crossing }}
      </pre>
      <b-button @click="goToUploadPage">Uploader des reservations</b-button>
      <BookingsTable
        :bookings="bookings.bookingList"
        :is-loading="bookings.fetchingBookings"
      />
    </div>
  </Layout>
</template>

<style lang="scss" module>
@import '@design';

.container {
  @extend %narrow-content;
}
</style>
