<script>
import { mapState } from 'vuex'

export default {
  props: {
    fullDeathNumber: {
      type: String,
      required: true,
    },
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
  },
}
</script>

<template>
  <div :class="$style.container">
    <h1 :class="$style.title">Passager {{ fullDeathNumber }}</h1>
    <div :class="$style.description">
      <BaseState :is-ok="hasFirm">
        <span slot="ok">FIRM rempli</span>
        <span slot="not-ok">Pas de FIRM</span>
      </BaseState>
      <BaseState :is-ok="isPresent">
        <span slot="ok">Accueilli</span>
        <span slot="not-ok">Absent</span>
      </BaseState>
    </div>
    <div :class="$style.actions">
      <BaseActionButton
        v-if="isPresent"
        icon="times"
        :loading="modifyingBooking || fetchingBookings"
        @click="setAbsent"
        >Exclure</BaseActionButton
      >
      <BaseActionButton
        v-else
        icon="hands-helping"
        :loading="modifyingBooking || fetchingBookings"
        @click="setPresent"
        >Accueillir</BaseActionButton
      >
      <BaseActionButton icon="clipboard-list">Lier un FIRM</BaseActionButton>
      <BaseActionButton icon="trash-alt" @click="$emit('deleteBooking')"
        >Supprimer</BaseActionButton
      >
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@design';
.container {
  padding: 2rem;
  text-align: left;
  background-color: $color-body-bg;
  .title {
    @extend %typography-large;
  }
  .description {
    margin-left: 0.5rem;
  }
  .actions {
    margin-top: 1rem;
    text-align: center;
  }
}
</style>
