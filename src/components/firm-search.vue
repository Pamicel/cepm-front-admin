<script>
import { mapActions, mapState } from 'vuex'
import FirmSummary from '@components/firm-summary.vue'

export default {
  components: {
    FirmSummary,
  },
  data() {
    return {
      firstname: '',
      lastname: '',
      timeoutID: null,
      firstnameStrict: false,
      lastnameStrict: false,
    }
  },
  computed: {
    regexFirstname() {
      return this.inputToRegex(this.firstname, this.firstnameStrict)
    },
    regexLastname() {
      return this.inputToRegex(this.lastname, this.lastnameStrict)
    },
    ...mapState({
      firms: (state) => state.forms.firms,
      fetchingFirms: (state) => state.forms.fetchingFirms,
    }),
  },
  mounted() {
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
    ...mapActions('forms', ['fetchFirms', 'cancelLastFetchFirms']),
    fetchFirmsDebounced() {
      const search = {
        firstname: this.regexFirstname,
        lastname: this.regexLastname,
      }
      const fn = () => this.fetchFirms({ search, backups: false })
      this.cancelLastFetchFirms()
      // debounce by 500ms
      if (this.timeoutID) {
        clearTimeout(this.timeoutID)
      }
      this.timeoutID = setTimeout(fn, 500)
    },
  },
}
</script>

<template>
  <div :class="$style.container">
    <h1 :class="$style.title">Trouver un FIRM</h1>

    <div :class="$style.searchField">
      <b-field label="Prénom" label-position="on-border">
        <b-input v-model="firstname" @input="fetchFirmsDebounced" />
      </b-field>
      <!-- <b-checkbox v-model="firstnameStrict" @input="fetchFirmsDebounced">
        <span>Strict</span>
      </b-checkbox> -->
    </div>
    <div :class="$style.searchField">
      <b-field label="Nom" label-position="on-border">
        <b-input v-model="lastname" @input="fetchFirmsDebounced" />
      </b-field>
      <!-- <b-checkbox v-model="lastnameStrict" @input="fetchFirmsDebounced">
        <span>Strict</span>
      </b-checkbox> -->
    </div>
    <div :class="$style.searchResults">
      <div v-if="fetchingFirms" :class="$style.loading"
        ><BaseIcon :class="$style.loadingIcon" name="fan" spin
      /></div>
      <div v-for="firm in firms" :key="firm.id">
        <hr :class="$style.summarySeparator" />
        <FirmSummary v-bind="firm" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@design';
.container {
  padding: 1rem;
  text-align: left;
}

.title {
  @extend %typography-large;

  margin-bottom: 1rem;
}

.searchField {
  margin: 0 0 1rem;
}
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
</style>
