<script>
import BookingActions from '@components/booking-actions.vue'

export default {
  components: { BookingActions },
  props: {
    booking: {
      type: Object,
      required: true,
    },
    initialState: {
      type: String,
      enum: ['is-open', 'is-closed'],
      default: 'is-closed',
    },
  },
  data() {
    return {
      forceCloseInfo: this.initialState === 'is-closed',
      isModifPanelOpen: false,
      modifPanelBooking: null,
    }
  },
  computed: {
    isOpenInfos() {
      return this.booking.match || !this.forceCloseInfo
    },
    fullDeathNumber() {
      return `${this.booking.id}-${this.booking.crossingId}-${this.booking.deathNumber}`
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
          {{ fullDeathNumber }}
        </b-tag>
      </div>

      <div :class="$style.bookingIdActions">
        <BaseActionButton
          v-if="!isOpenInfos"
          :disabled="booking.match"
          icon="eye"
          @click="() => (forceCloseInfo = false)"
          >Déplier</BaseActionButton
        >
        <BaseActionButton
          v-else
          icon="eye-slash"
          @click="() => (forceCloseInfo = true)"
          >Plier</BaseActionButton
        >
      </div>

      <div :class="$style.bookingIdStatus">
        <BaseState
          :class="$style.bookingStatusState"
          :is-ok="!!booking.present"
        >
          <span slot="ok">Pointé</span>
          <span slot="not-ok">Non pointé</span>
        </BaseState>
        <BaseState
          :class="$style.bookingStatusState"
          :is-ok="!!booking.users && booking.users.length > 0"
        >
          <span slot="ok">FIRM rempli</span>
          <span slot="not-ok">Pas de FIRM</span>
        </BaseState>
      </div>
    </div>

    <div v-if="isOpenInfos" :class="$style.infos">
      <div :class="$style.panel">
        <BookingActions
          :full-death-number="fullDeathNumber"
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
  // @include debossed_paper_shadow();

  padding: 1rem 3rem 0.5rem;
  margin: 1rem 0;
  background-color: $color-body-bg;
  border-radius: 8px;
  transition: padding 200ms ease-in;
  &.isMatch {
    border: 1px solid red;
  }
  &.isOpen {
    padding: 1.5rem 3rem 2rem;
  }

  .panel {
    .panelHeading {
      @extend %typography-medium;
    }
  }

  .bookingId {
    display: flex;
    @media screen and (max-width: $size-breakpoint-small) {
      flex-direction: column;
      align-items: center;
    }

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
      align-items: left;
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
    border-top: 1px solid rgba(0, 0, 0, 0.2);
  }

  // .bookingDetailsHeader {
  // }
}
</style>
