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
      fetchingBookings: (state) => state.crossings.fetchingBookings,
      fetchingCrossing: (state) => state.crossings.fetchingSingleCrossing,
      sendingEmailToBookers: (state) => state.bookings.sendingEmailToBookers,
      crossing: (state) => state.crossings.selectedCrossing,
      bookingList: (state) => state.bookings.bookingList,
    }),
    bookings() {
      if (this.sendingEmailToBookers.length === 0) {
        return this.bookingList
      }
      return this.bookingList.map((booking) => {
        const emailing = this.sendingEmailToBookers.includes(
          booking.bookerEmail
        )
        return {
          ...booking,
          emailing,
        }
      })
    },
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
    async sendEmail(bookerEmail) {
      const crossingId = this.$route.params.id
      this.$store.dispatch('bookings/sendEmailToBooker', {
        bookerEmail,
        crossingId,
      })
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
        :bookings="bookings"
        :is-loading="fetchingBookings"
        @sendEmail="sendEmail"
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
