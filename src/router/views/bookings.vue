<script>
import Layout from '@layouts/local.vue'
import BookingGroupsTable from '@components/booking-groups-table.vue'
import BookingsTable from '@components/bookings-table.vue'
import CrossingInfos from '@components/crossing-infos.vue'
import BookingsUpload from '@components/bookings-upload.vue'
import BookingForm from '@components/booking-form.vue'
import CollapseForm from '@components/collapse-form.vue'
import { mapState } from 'vuex'

export default {
  page: {
    title: 'Panneau de traversée',
    meta: [{ name: 'description', content: 'The Crossing Details page.' }],
  },
  components: {
    Layout,
    BookingsTable,
    BookingGroupsTable,
    CrossingInfos,
    BookingsUpload,
    CollapseForm,
    BookingForm,
  },
  data() {
    return {
      formOpen: false,
      isSingleFormOpen: false,
      isBookingUploadOpen: false,
    }
  },
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
        const { groupNumber, id } = booking

        if (bookingGroupObject[groupNumber]) {
          // If the booking group exists
          // Add the booking to it
          bookingGroupObject[groupNumber].bookings.push(id)
        } else {
          // If it doesn't
          // Create it and add the booking to it
          bookingGroupObject[groupNumber] = {
            bookerEmail: booking.bookerEmail,
            groupNumber: booking.groupNumber,
            importDate: booking.importDate,
            emailed: booking.emailed,
            bookings: [id],
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
    async sendEmail(bookerEmail) {
      const crossingId = this.$route.params.id
      this.$store.dispatch('bookings/sendEmailToBooker', {
        bookerEmail,
        crossingId,
      })
    },
    closeUploadForm() {
      this.isBookingUploadOpen = false
    },
    uploadDone() {
      const crossingId = this.$route.params.id
      this.closeUploadForm()
      this.$store.dispatch('bookings/fetchBookings', {
        crossingId,
      })
    },
    newBookingDone() {
      this.isSingleFormOpen = false
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
      <hr />
      <CollapseForm
        v-if="crossing"
        :form-open.sync="isBookingUploadOpen"
        title="+ Ajouter une liste de personnes"
      >
        <BookingsUpload
          :crossing-id="crossing && crossing.id"
          @done="uploadDone"
        />
      </CollapseForm>

      <CollapseForm
        v-if="crossing"
        :form-open.sync="isSingleFormOpen"
        title="+ Ajouter une personne"
      >
        <BookingForm
          :crossing-id="crossing && crossing.id"
          @done="newBookingDone"
        />
      </CollapseForm>
      <hr />

      <b-tabs>
        <b-tab-item label="Passagers">
          <BookingsTable
            :bookings="bookingList"
            :is-loading="fetchingBookings"
          />
        </b-tab-item>
        <b-tab-item label="Emails d'accueil">
          <BookingGroupsTable
            :groups="groups"
            :is-loading="fetchingBookings"
            @sendEmail="sendEmail"
          />
        </b-tab-item>
      </b-tabs>
    </div>
  </Layout>
</template>

<style lang="scss" module>
@import '@design';

.container {
  @extend %narrow-content;
  .title {
    margin: 0 auto 2rem;
    text-align: center;
  }
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
  .uploadModal {
    position: relative;
    box-sizing: border-box;
    width: 50rem;
    max-width: 90%;
    height: 100%;
    margin: auto;
    overflow: auto;
    background: $color-body-bg;
    border-radius: 8px;
  }
}
</style>
