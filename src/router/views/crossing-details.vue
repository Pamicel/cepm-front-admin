<script>
import Layout from '@layouts/local.vue'
import { mapState } from 'vuex'

export default {
  page: {
    title: 'Panneau de traversée',
    meta: [{ name: 'description', content: 'The Crossing Details page.' }],
  },
  components: { Layout },
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
    async goToUploadPage() {
      this.$router.push({ name: 'bookings-upload' })
    },
    async goToBookingsPage() {
      this.$router.push({ name: 'bookings' })
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
      <b-button v-if="bookings.bookingList.length" @click="goToBookingsPage"
        >Voir les réservations</b-button
      >
      <b-button v-else @click="goToUploadPage"
        >Uploader des réservations</b-button
      >
    </div>
  </Layout>
</template>

<style lang="scss" module>
@import '@design';

.container {
  @extend %narrow-content;
}
</style>
