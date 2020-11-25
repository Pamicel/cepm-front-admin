<script>
import Layout from '@layouts/local.vue'
import BookingsTable from '@components/bookings-table.vue'
import CrossingInfos from '@components/crossing-infos.vue'
import { mapState } from 'vuex'

export default {
  page: {
    title: 'Panneau de traversée',
    meta: [{ name: 'description', content: 'The Crossing Details page.' }],
  },
  components: { Layout, BookingsTable, CrossingInfos },
  computed: {
    ...mapState({
      fetchingBookings: (state) => state.crossings.fetchingBookings,
      fetchingCrossing: (state) => state.crossings.fetchingSingleCrossing,
      sendingEmailToBookers: (state) => state.bookings.sendingEmailToBookers,
      crossing: (state) => state.crossings.selectedCrossing,
      bookingList: (state) => state.bookings.bookingList,
    }),
    groups() {
      const bookingGroupObject = {}
      for (const booking of this.bookingList) {
        const { groupNumber } = booking
        const parsedRaw = JSON.parse(booking.raw)
        const parsedBooking = {
          ...booking,
          parsedRaw,
        }

        if (bookingGroupObject[groupNumber]) {
          // If the booking group exists
          // Add the booking to it
          bookingGroupObject[groupNumber].bookings.push(parsedBooking)
        } else {
          // If it doesn't
          // Create it and add the booking to it
          bookingGroupObject[groupNumber] = {
            bookerEmail: booking.bookerEmail,
            groupNumber: booking.groupNumber,
            importDate: booking.importDate,
            emailed: booking.emailed,
            bookings: [parsedBooking],
          }
        }
      }

      const bookingGroupArray = Object.values(bookingGroupObject)

      // Add number of bookings in group
      bookingGroupArray.forEach((group) => {
        group.numberOfBookings = group.bookings.length
      })

      if (this.sendingEmailToBookers.length === 0) {
        return bookingGroupArray
      }

      // Tag weither groups are being emailed
      return bookingGroupArray.map((group) => {
        const emailing = this.sendingEmailToBookers.includes(group.bookerEmail)
        return {
          ...group,
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
      <CrossingInfos
        v-if="!fetchingCrossing && crossing"
        :crossing="crossing"
      />
      <BaseIcon v-else :class="$style.loadingIcon" name="fan" spin />

      <div :class="$style.upload">
        <button :class="$style.uploadButton" @click="goToUploadPage">+</button>
      </div>
      <BookingsTable
        :groups="groups"
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
  .upload {
    text-align: center;
    .uploadButton {
      @include embossed_paper_shadow(2);
      @extend %typography-xlarge;

      width: 5rem;
      height: 5rem;
      margin: 1rem auto;
      cursor: pointer;
      background: transparent;
      border: 0;
      border-radius: 50rem;
      &:focus {
        @include embossed_paper_shadow(1);
      }
    }
  }
}
</style>
