<script>
import { mapState } from 'vuex'
import FirmSearch from '@components/firm-search.vue'

export default {
  components: { FirmSearch },
  props: {
    booking: {
      type: Object,
      required: true,
    },
    isPresent: {
      type: Boolean,
      default: false,
    },
    hasFirm: {
      type: Boolean,
      default: false,
    },
  },
  data: function() {
    return {
      isFirmSearchOpen: false,
    }
  },
  computed: {
    ...mapState({
      modifyingBooking: (state) => state.bookings.modifyingBooking,
      fetchingBookings: (state) => state.bookings.fetchingBookings,
    }),
  },
  methods: {
    setPresent() {
      this.$store.dispatch('bookings/modifyBooking', {
        bookingId: this.booking.id,
        crossingId: this.booking.crossingId,
        modifs: { present: true },
      })
    },
    setAbsent() {
      this.$store.dispatch('bookings/modifyBooking', {
        bookingId: this.booking.id,
        crossingId: this.booking.crossingId,
        modifs: { present: false },
      })
    },
    openFirmSearch(booking) {
      this.isFirmSearchOpen = true
      this.firmSearchBooking = booking
    },
    closeFirmSearch() {
      this.isFirmSearchOpen = false
      this.firmSearchBooking = null
    },
  },
}
</script>

<template>
  <div :class="$style.container">
    <div :class="$style.actions">
      <BaseActionButton
        v-if="isPresent"
        :class="$style.button"
        icon="times"
        :loading="modifyingBooking || fetchingBookings"
        @click="setAbsent"
        >Retirer</BaseActionButton
      >
      <BaseActionButton
        v-else
        :class="$style.button"
        icon="check"
        :loading="modifyingBooking || fetchingBookings"
        @click="setPresent"
        >Pointer</BaseActionButton
      >
      <BaseActionButton
        :class="$style.button"
        icon="clipboard-list"
        @click="openFirmSearch"
        >Lier un FIRM</BaseActionButton
      >
      <BaseActionButton
        :class="$style.button"
        icon="trash-alt"
        @click="$emit('deleteBooking')"
        >Supprimer</BaseActionButton
      >
    </div>
    <b-modal :active="isFirmSearchOpen" @close="closeFirmSearch">
      <div :class="$style.firmSearch">
        <FirmSearch :booking-id="booking.id" />
      </div>
    </b-modal>
  </div>
</template>

<style lang="scss" module>
@import '@design';
.container {
  text-align: center;
  background-color: $color-body-bg;

  .firmSearch {
    position: relative;
    box-sizing: border-box;
    width: 50rem;
    max-width: 90%;
    height: 100%;
    margin: auto;
    overflow: hidden;
    background: #fff;
    border-radius: 8px;
  }
}
</style>
