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
      forceCloseInfo: true,
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
    openModifPanel(booking) {
      this.isModifPanelOpen = true
      this.modifPanelBooking = booking
    },
    closeModifPanel() {
      this.isModifPanelOpen = false
      this.modifPanelBooking = null
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
          >Voir plus</BaseActionButton
        >
        <BaseActionButton
          v-else
          icon="eye-slash"
          @click="() => (forceCloseInfo = true)"
          >Cacher</BaseActionButton
        >
        <BaseActionButton @click="openModifPanel(booking.id)"
          >Modifier</BaseActionButton
        >
        <b-modal :active="isModifPanelOpen" @close="closeModifPanel">
          <div :class="$style.modifPanel">
            <BookingActions
              :full-death-number="fullDeathNumber"
              :booking="booking"
              :is-present="booking.present"
            />
          </div>
        </b-modal>
      </div>
    </div>
    <!--
    <b-collapse
      class="panel"
      animation="slide"
      :open="isOpenInfos"
      :class="$style.panel"
      @open="() => (forceCloseInfo = false)"
      @close="() => (forceCloseInfo = true)"
    > -->
    <div v-if="isOpenInfos" :class="$style.panel">
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
    <!-- </b-collapse> -->

    <!-- <b-collapse
      class="panel"
      animation="slide"
      :open="!closedActions"
      @open="() => (closedActions = false)"
      @close="() => (closedActions = true)"
    > -->
    <!-- <div :class="$style.panel">
      <div slot="trigger" :class="$style.panelHeading">
        <BaseIcon name="receipt" /> <strong>Actions</strong>
      </div>
      <div :class="$style.bookingActions">
        <b-button
          icon-left="clipboard-list"
          :class="$style.bookingActionsButton"
        >
          Connecter à un FIRM
        </b-button>
        <br />
        <b-button
          type="is-danger"
          icon-left="calendar-times"
          :class="$style.bookingActionsButton"
          >Annuler la réservation</b-button
        >
      </div>
    </div> -->
    <!-- </b-collapse> -->

    <!--  -->
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

  .modifPanel {
    position: relative;
    width: 50rem;
    max-width: 100%;
    margin: auto;
    overflow: hidden;
    background: #fff;
    border-radius: 8px;
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
  }

  .bookingActionsButton {
    margin: 0.5rem 0;
  }

  // .bookingDetailsHeader {
  // }
}
</style>
