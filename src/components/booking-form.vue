<script>
import { mapActions, mapState } from 'vuex'
export default {
  props: {
    crossingId: {
      type: [String, Number],
      required: true,
    },
  },
  data() {
    return {
      bookerEmail: '',
      firstname: '',
      lastname: '',
    }
  },
  computed: {
    ...mapState({
      creatingSingleBooking: (state) => state.bookings.creatingSingleBooking,
    }),
  },
  methods: {
    ...mapActions({
      createSingleBooking: 'bookings/createSingleBooking',
    }),
    async send() {
      const { crossingId, bookerEmail, firstname, lastname } = this
      const response = await this.createSingleBooking({
        crossingId,
        bookerEmail,
        firstname,
        lastname,
      })

      if (response) {
        this.$buefy.toast.open({
          type: 'is-success',
          message: 'Passager·ère créé·e',
        })
        this.bookerEmail = ''
        this.$emit('done')
      } else {
        this.$buefy.toast.open({
          type: 'is-danger',
          message: 'Erreur lors de la création',
        })
      }
    },
  },
}
</script>

<template>
  <div :class="$style.addBooking">
    <b-field label="Email (obligatoire)" label-position="on-border">
      <b-input v-model="bookerEmail" />
    </b-field>
    <b-field label="Prénom (facultatif)" label-position="on-border">
      <b-input v-model="firstname" />
    </b-field>
    <b-field label="Nom (facultatif)" label-position="on-border">
      <b-input v-model="lastname" />
    </b-field>
    <b-button
      :loading="creatingSingleBooking"
      :disabled="creatingSingleBooking || !bookerEmail"
      :class="$style.addBookingButton"
      type="is-success"
      @click="send"
      >Ajouter</b-button
    >
  </div>
</template>

<style lang="scss" module>
@import '@design';
</style>
