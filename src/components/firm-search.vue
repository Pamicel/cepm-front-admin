<script>
import { mapActions, mapState } from 'vuex'
import FirmSummary from '@components/firm-summary.vue'

export default {
  components: {
    FirmSummary,
  },
  props: {
    bookingId: {
      type: [String, Number],
      required: true,
    },
  },
  data() {
    return {
      firstname: '',
      lastname: '',
      timeoutID: null,
      firstnameStrict: false,
      lastnameStrict: false,
      initialised: false,
    }
  },
  computed: {
    regexFirstname(state) {
      return state.inputToRegex(state.firstname, state.firstnameStrict)
    },
    regexLastname(state) {
      return state.inputToRegex(state.lastname, state.lastnameStrict)
    },
    ...mapState({
      firms: (state) => state.forms.firms,
      fetchingFirms: (state) => state.forms.fetchingFirms,
      bookingsBeingRefreshed: (state) => state.bookings.bookingsBeingRefreshed,
      backingFirmUp: (state) => state.forms.backingFirmUp,
    }),
    loading(state) {
      return (
        state.fetchingFirms ||
        !state.initialised ||
        state.bookingsBeingRefreshed.includes(state.bookingId)
      )
    },
    firmBeingSent(state) {
      return state.backingFirmUp[state.bookingId]
    },
    displayedFirmList(state) {
      // If no firm is being sent for this booking
      if (state.firmBeingSent === undefined) {
        return state.firms
      }
      // Otherwise
      return state.firms.filter((firm) => firm.id === state.firmBeingSent)
    },
  },
  async mounted() {
    this.fetchFirmsDebounced()
  },
  methods: {
    inputToRegex(input = '', strict) {
      input = input.trim()
      if (input === '') {
        return ''
      }
      const inputs = input
        .split(' ')
        .map((str) => str.split('-'))
        .flat()
        .filter(Boolean)
      if (strict || inputs.length === 1) {
        return `.*${input}.*`
      } else {
        return `.*(${input}|${inputs.join('|')}).*`
      }
    },
    ...mapActions('forms', [
      'fetchFirms',
      'cancelLastFetchFirms',
      'backupFirm',
    ]),
    setInitialised() {
      this.initialised = true
    },
    fetchFirmsDebounced() {
      const search = {
        firstname: this.regexFirstname,
        lastname: this.regexLastname,
      }

      const fn = () =>
        this.fetchFirms({ search, backups: false })
          .then(this.setInitialised)
          .catch(this.setInitialised)

      this.cancelLastFetchFirms()
      // debounce by 500ms
      if (this.timeoutID) {
        clearTimeout(this.timeoutID)
      }
      this.timeoutID = setTimeout(fn, 500)
    },
    async chooseFirm({ firmId, bookingId }) {
      await this.backupFirm({ firmId, bookingId })
      this.$emit('done')
    },
    isLoading({ bookingId, firmId }) {
      return this.backingFirmUp[bookingId] === firmId
    },
  },
}
</script>

<template>
  <div :class="$style.container">
    <div :class="$style.searchTool">
      <h1 :class="$style.title">Trouver un FIRM</h1>

      <div :class="$style.searchField">
        <b-field label="Nom" label-position="on-border">
          <b-input
            v-model="lastname"
            :disabled="firmBeingSent !== undefined"
            :loading="firmBeingSent !== undefined"
            @input="fetchFirmsDebounced"
          />
        </b-field>
      </div>

      <div :class="$style.searchField">
        <b-field label="Prénom" label-position="on-border">
          <b-input
            v-model="firstname"
            :disabled="firmBeingSent !== undefined"
            :loading="firmBeingSent !== undefined"
            @input="fetchFirmsDebounced"
          />
        </b-field>
      </div>
    </div>

    <div :class="$style.counter">
      Résultats: {{ loading ? '...' : firms.length }}
    </div>

    <div :class="$style.searchResults">
      <div v-if="loading"
        ><div v-for="index in [0, 1, 2, 3]" :key="index">
          <hr :class="$style.summarySeparator" />
          <FirmSummary skeleton /> </div
      ></div>
      <div v-else>
        <transition-group name="slide-fade" mode="out-in">
          <div v-for="firm in displayedFirmList" :key="firm.id">
            <hr :class="$style.summarySeparator" />
            <FirmSummary
              v-bind="firm"
              :loading="isLoading({ firmId: firm.id, bookingId })"
              action-name="Utiliser ce FIRM"
              @action="() => chooseFirm({ firmId: firm.id, bookingId })"
            />
          </div>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@design';
.container {
  display: grid;
  grid-template-rows: auto auto 1fr;
  height: 100%;
  min-height: 60vh;
  max-height: 90vh;
  padding: 1rem;
  text-align: left;

  .searchTool {
    .title {
      @extend %typography-large;

      margin-bottom: 1rem;
    }

    .searchField {
      margin: 0 0 1rem;
    }
  }

  .counter {
    @extend %typography-small;

    margin: 0 0.5em 0.5em;
    font-weight: bold;
    text-align: right;
  }

  .searchResults {
    overflow: scroll;
    background-color: $color-body-bg;
    // height: 100%;
    border-radius: 8px;
    transition: all 200ms;
    .summarySeparator {
      padding: 0;
      margin: 0;
    }
    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1rem;
      .loadingIcon {
        @extend %typography-large;
      }
    }
  }
}
</style>
