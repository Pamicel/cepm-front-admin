<script>
export default {
  data() {
    return { email: '', password: '', passwordRepeat: '', errors: {} }
  },
  computed: {
    incomplete() {
      return (
        this.email === '' || this.password === '' || this.passwordRepeat === ''
      )
    },
  },
  methods: {
    validateForm() {
      const emailRe = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      const emailIsValid = emailRe.test(this.email)
      const passwordIsValid = this.password.length >= 8
      const passwordRepeatIsValid = this.password === this.passwordRepeat

      this.errors = {
        email: !emailIsValid,
        password: !passwordIsValid,
        passwordRepeat: !passwordRepeatIsValid,
      }

      return emailIsValid && passwordIsValid && passwordRepeatIsValid
    },
    resetState() {
      this.email = ''
      this.password = ''
      this.passwordRepeat = ''
      this.errors = {}
    },
    cancel() {
      this.$emit('cancel')
      this.resetState()
    },
    async send() {
      const validForm = this.validateForm()
      if (validForm) {
        this.$emit('send', {
          email: this.email,
          password: this.password,
        })
        this.resetState()
      }
    },
  },
}
</script>

<template>
  <div :class="$style.container">
    <form @submit.stop>
      <div :class="[$style.fieldGroup, $style.fieldGroupVertical]">
        <div :class="$style.field">
          <label :class="$style.fieldTitle">Email</label>
          <b-field
            :type="errors.email ? 'is-danger' : 'is-normal'"
            :message="errors.email ? 'Cet email est invalide' : ''"
          >
            <b-input
              v-model="email"
              validation-message="Ceci ne ressemble pas à une adresse email"
              type="email"
              :class="$style.input"
            >
            </b-input>
          </b-field>
        </div>
        <div :class="$style.field">
          <label :class="$style.fieldTitle">Mot de passe</label>
          <b-field
            :type="errors.password ? 'is-danger' : 'is-normal'"
            :message="
              errors.password ? 'Le mot de passe n\'est pas assez long' : ''
            "
          >
            <b-input v-model="password" type="password" :class="$style.input">
            </b-input>
          </b-field>
        </div>
        <div :class="$style.field">
          <label :class="$style.fieldTitle">Répétez le mot de passe</label>
          <b-field
            :type="errors.passwordRepeat ? 'is-danger' : 'is-normal'"
            :message="
              errors.passwordRepeat
                ? 'Les mots de passe ne correspondent pas'
                : ''
            "
          >
            <b-input
              v-model="passwordRepeat"
              type="password"
              :class="$style.input"
            >
            </b-input>
          </b-field>
        </div>
      </div>
    </form>
    <div :class="$style.buttons">
      <b-button
        :class="$style.buttonsButton"
        type="is-danger"
        outlined
        @click="cancel"
      >
        Annuler
      </b-button>
      <b-button
        :disabled="incomplete"
        :class="$style.buttonsButton"
        type="is-success"
        @click="send"
      >
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
