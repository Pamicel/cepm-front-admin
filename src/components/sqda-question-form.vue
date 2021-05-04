<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      question: '',
    }
  },
  computed: {
    ...mapState('sqda', {
      fetchingQuestions: (state) => state.fetchingQuestions,
      creatingQuestion: (state) => state.creatingQuestion,
    }),
  },
  methods: {
    async createQuestion() {
      const response = await this.$store.dispatch('sqda/createQuestion', {
        question: this.question.trim(),
      })

      if (response && response.error && response.error.status === 409) {
        this.$buefy.toast.open({
          type: 'is-danger',
          message: 'Cette question existe déjà',
        })
        return
      } else if (!response) {
        this.$buefy.toast.open({
          type: 'is-danger',
          message: 'Erreur inconnue',
        })
        return
      }

      this.question = ''
      this.$emit('done')
    },
  },
}
</script>

<template>
  <div :class="$style.container">
    <b-input v-model="question" type="textarea"></b-input>
    <b-button
      type="is-success"
      :disabled="fetchingQuestions || creatingQuestion || question === ''"
      :loading="creatingQuestion"
      :class="$style.submitButton"
      @click="createQuestion"
      >Créer</b-button
    >
  </div>
</template>

<style lang="scss" module>
@import '@design';
.container {
  .submitButton {
    margin-top: 1rem;
  }
}
</style>
