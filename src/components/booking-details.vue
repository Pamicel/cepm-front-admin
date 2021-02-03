<script>
import BookingActions from '@components/booking-actions.vue'

export default {
  components: { BookingActions },
  props: {
    booking: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      modifPanelBooking: null,
    }
  },
  computed: {
    isOpenInfos() {
      return this.booking.match || !this.forceCloseInfo
    },
  },
  methods: {
    tableRaw(booking) {
      return Object.entries(booking.parsedRaw)
        .filter(([key, value]) => value)
        .map(([key, value]) => ({
          key,
          value,
        }))
    },
    async deletePassenger(booking) {
      await this.$store.dispatch('bookings/deleteBooking', {
        bookingId: booking.id,
        crossingId: booking.crossingId,
      })
      if (this.modifPanelBooking.id === booking.id) {
        this.closeModifPanel()
      }
    },
    deletePassengerDialog(booking) {
      this.$buefy.dialog.confirm({
        message:
          'Êtes-vous sûr·e de vouloir supprimer ce·cette passager·ère ? Cette action est définitive.',
        title: 'Supprimer le·a passager·ère',
        confirmText: 'Supprimer',
        onConfirm: () => this.deletePassenger(booking),
        cancelText: 'Annuler',
        type: 'is-danger',
      })
    },
  },
}
</script>

<template>
  <div
    :class="[
      $style.container,
      booking.match && $style.isMatch,
      isOpenInfos && $style.isOpen,
    ]"
  >
    <div :class="$style.bookingId">
      <div :class="$style.bookingIdDeathNumber">
        Décédé·e numéro
        <br />
        <b-tag type="is-dark" size="is-large" :class="$style.deathNumber">
          {{ booking.fullDeathNumber }}
        </b-tag>
      </div>
    </div>

    <div :class="$style.infos">
      <div :class="$style.panel">
        <BookingActions
          :full-death-number="booking.fullDeathNumber"
          :booking="booking"
          :is-present="booking.present"
          @deleteBooking="() => deletePassengerDialog(booking)"
        />
      </div>
      <div :class="$style.panel">
        <div :class="$style.panelHeading">
          <BaseIcon name="receipt" /> <strong>Infos brutes</strong>
        </div>
        <b-table :data="tableRaw(booking)">
          <template slot-scope="table">
            <b-table-column field="key">{{ table.row.key }}</b-table-column>
            <b-table-column field="value">{{ table.row.value }}</b-table-column>
          </template>
        </b-table>
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@design';

.container {
  padding: 1.5rem 3rem 2rem;
  margin: 1rem 0;
  background-color: $color-body-bg;
  border-radius: 8px;
  &.isMatch {
    border: 1px solid red;
  }

  .panel {
    .panelHeading {
      @extend %typography-medium;
    }
  }

  .bookingId {
    display: flex;
    justify-content: space-between;
    margin: 0.5rem 0;
    text-align: center;
    .bookingIdActionsButton {
      @include embossed_paper_shadow(2);
      @extend %typography-small;

      padding: 1rem;
      margin: 1rem;
      cursor: pointer;
      background: transparent;
      border: 0;
      border-radius: 8px;
      .eye {
        margin-right: 0.5rem;
      }
    }

    .bookingIdDeathNumber {
      display: flex;
      flex-direction: column;
      align-items: start;
      justify-content: start;
    }

    .bookingIdStatus {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      justify-content: center;
    }

    .bookingIdDeathNumber,
    .bookingIdActions,
    .bookingIdStatus {
      width: 30%;
    }
  }

  .bookingActionsButton {
    margin: 0.5rem 0;
  }

  .infos {
    padding-top: 1rem;
  }
}
</style>
