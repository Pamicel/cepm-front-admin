<script>
import formatDuration from '@utils/format-duration.js'

export default {
  data() {
    return this.initData()
  },
  computed: {
    dayAfter(state) {
      return (
        state.endDate.getHours() < state.startDate.getHours() ||
        (state.endDate.getHours() === state.startDate.getHours() &&
          state.endDate.getMinutes() <= state.startDate.getMinutes())
      )
    },
    duration(state) {
      const endTimeMinutes =
        state.endDate.getMinutes() + state.endDate.getHours() * 60
      const dateMinutes =
        state.startDate.getMinutes() + state.startDate.getHours() * 60
      const dayInMinutes = 24 * 60

      const minuteDiff = state.dayAfter
        ? dayInMinutes - dateMinutes + endTimeMinutes
        : endTimeMinutes - dateMinutes

      return minuteDiff
    },
    durationDisplay(state) {
      return formatDuration(state.duration)
    },
  },
  methods: {
    initData() {
      const sevenDaysInMs = this.minToMs(7 * 24 * 60)
      const startDate = new Date(Date.now() + sevenDaysInMs)
      startDate.setMinutes(0)
      const duration = 20
      const endDate = new Date(startDate.getTime() + this.minToMs(duration))

      return {
        startDate,
        endDate,
        audienceSize: 20,
      }
    },
    minToMs(minutes) {
      return minutes * 60 * 1000
    },
    resetState() {
      const state = this.initData()
      this.startDate = state.startDate
      this.endDate = state.endDate
      this.audienceSize = state.audienceSize
    },
    cancel() {
      this.$emit('cancel')
      this.resetState()
    },
    send() {
      this.$emit('send', {
        duration: parseInt(this.duration),
        startDate: this.startDate,
        audienceSize: parseInt(this.audienceSize),
      })
      this.resetState()
    },
  },
}
</script>

<template>
  <div :class="$style.container">
    <form @submit.stop>
      <div :class="[$style.fieldGroup, $style.fieldGroupVertical]">
        <div :class="$style.field">
          <label :class="$style.fieldTitle">Date</label>
          <b-datepicker
            v-model="startDate"
            :class="$style.input"
            :month-names="$moment.months()"
            :day-names="$moment.weekdaysShort()"
            :first-day-of-week="1"
          ></b-datepicker>
        </div>
        <div :class="$style.field">
          <label :class="$style.fieldTitle">Jauge</label>
          <b-input
            v-model="audienceSize"
            type="number"
            :class="$style.input"
            min="1"
            data-test-name="audienceInput"
          >
          </b-input>
        </div>
      </div>
      <div :class="$style.fieldGroup">
        <div :class="$style.field">
          <label :class="$style.fieldTitle">Début</label>
          <b-timepicker
            v-model="startDate"
            :class="$style.input"
            :increment-minutes="5"
            inline
          ></b-timepicker>
        </div>
        <div :class="$style.field">
          <label :class="$style.fieldTitle">Fin</label>
          <b-timepicker
            v-model="endDate"
            :class="$style.input"
            inline
            :increment-minutes="5"
          ></b-timepicker>

          <b-tag v-if="dayAfter" :class="$style.dayAfter"
            >🌚 Finit le lendemain</b-tag
          >
        </div>
      </div>
    </form>
    <div :class="$style.field">
      <label :class="$style.fieldTitle">Durée</label>
      <br />
      <b-tag class="is-large" :class="$style.dayAfter">{{
        durationDisplay
      }}</b-tag>
    </div>
    <div :class="$style.buttons">
      <b-button
        :class="$style.buttonsButton"
        type="is-danger"
        outlined
        @click="cancel"
      >
        Annuler
      </b-button>
      <b-button :class="$style.buttonsButton" type="is-success" @click="send">
        Ok
      </b-button>
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@design';
.container {
  .buttons {
    // margin: 0.5rem 1rem;
    text-align: right;
    .buttonsButton {
      margin: 0.5rem;
    }
  }
  form {
    .fieldGroup {
      display: flex;
      &.fieldGroupVertical {
        flex-direction: column;
      }
    }
  }
  .field {
    margin: 0.5rem 1rem;
    .fieldTitle {
      display: inline-block;
      margin-bottom: 0.2rem;
      font-weight: bold;
      text-align-last: left;
    }
  }
}
</style>
