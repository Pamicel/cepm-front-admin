<script>
import { mapActions, mapState } from 'vuex'

export default {
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
    }),
  },
  methods: {
    inputToRegex(input = '', strict) {
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
      const fn = () => this.fetchFirms({ search })
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
  <div>
    <label :class="$style.fieldTitle">Prénom</label>
    <b-input v-model="firstname" @input="fetchFirmsDebounced" />
    <b-switch v-model="firstnameStrict" @input="fetchFirmsDebounced" />
    <label :class="$style.fieldTitle">Nom</label>
    <b-input v-model="lastname" @input="fetchFirmsDebounced" />
    <b-switch v-model="lastnameStrict" @input="fetchFirmsDebounced" />
    {{ regexFirstname }} {{ regexLastname }}
    {{ firms }}
  </div>
</template>

<style lang="scss" module>
@import '@design';
</style>
