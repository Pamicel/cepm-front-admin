<script>
import { mapState } from 'vuex'
import FirmSearch from '@components/firm-search.vue'
import FirmSummary from '@components/firm-summary.vue'

export default {
  components: { FirmSearch, FirmSummary },
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
      isFirmSummaryOpen: false,
    }
  },
  computed: {
    ...mapState({
      modifyingBooking: (state) => state.bookings.modifyingBooking,
      fetchingBookings: (state) => state.bookings.fetchingBookings,
      firmsBeingDeleted: (state) => state.forms.firmsBeingDeleted,
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
    openFirmSummary(booking) {
      this.isFirmSummaryOpen = true
      this.firmSummaryBooking = booking
    },
    closeFirmSummary() {
      this.isFirmSummaryOpen = false
      this.firmSummaryBooking = null
    },
    async deleteFirm(firmId) {
      const success = await this.$store.dispatch('forms/deleteFirm', { firmId })
      if (!success) {
        this.$buefy.toast.open({
          duration: 5000,
          message: `<b>Échec du changement de FIRM</b>: une erreur inconnue s'est produite.`,
          position: 'is-top',
          type: 'is-danger',
        })
      } else {
        this.closeFirmSummary()
        this.openFirmSearch()
      }
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
        v-if="!booking.hasFirm"
        :class="$style.button"
        icon="clipboard-list"
        @click="openFirmSearch"
        >Lier un FIRM</BaseActionButton
      >
      <BaseActionButton
        v-else
        :class="$style.button"
        icon="eye"
        @click="openFirmSummary"
        >Voir le FIRM</BaseActionButton
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
        <FirmSearch :booking-id="booking.id" @done="closeFirmSearch" />
      </div>
    </b-modal>
    <b-modal
      v-if="booking.hasFirm"
      :active="isFirmSummaryOpen"
      @close="closeFirmSummary"
    >
      <div :class="$style.firmSummary">
        <FirmSummary
          :loading="firmsBeingDeleted.includes(booking.formFirm.id)"
          v-bind="booking.formFirm"
          action-name="Désassocier"
          @action="() => deleteFirm(booking.formFirm.id)"
        />
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
  .firmSummary {
    position: relative;
    max-width: 30rem;
    padding: 1.5rem 0.5rem;
    margin: auto;
    background: $color-body-bg;
    border-radius: 8px;
  }
}
</style>
