<script>
import Layout from '@layouts/local.vue'
import appConfig from '@src/app.config'
import { mapActions, mapState } from 'vuex'

export default {
  page: {
    title: 'Log in',
    meta: [{ name: 'description', content: `Log in to ${appConfig.title}` }],
  },
  components: { Layout },
  data() {
    return {
      email: '',
      password: '',
      authError: null,
    }
  },
  computed: {
    ...mapState({
      loggingIn: (state) => state.auth.loggingIn,
    }),
    incomplete(state) {
      return state.email === '' || state.password === ''
    },
  },
  methods: {
    ...mapActions('auth', ['logIn', 'logOut']),
    // Try to log the user in with the email
    // and password they provided.
    async tryToLogIn() {
      if (this.incomplete) {
        return
      }

      // Reset the authError if it existed.
      try {
        this.authError = null
        await this.logIn({
          email: this.email,
          password: this.password,
        })
        // Redirect to the originally requested page, or to the home page
        this.$router.push(this.$route.query.redirectFrom || { name: 'home' })
      } catch (error) {
        this.authError = error
      }
    },
  },
}
</script>

<template>
  <Layout narrow>
    <div :class="$style.loginBox">
      <form :class="$style.form" @submit.prevent="tryToLogIn">
        <!-- <h1 :class="$style.title">Se connecter</h1> -->
        <b-field label="Email">
          <b-input
            v-model="email"
            aria-required="true"
            name="email"
            placeholder="Email"
            type="email"
            @keyup.enter.native="
              incomplete ? $refs.passwordInput.focus() : tryToLogIn
            "
          />
        </b-field>
        <b-field label="Mot de passe">
          <b-input
            ref="passwordInput"
            v-model="password"
            aria-required="true"
            :class="$style.input"
            name="password"
            type="password"
            placeholder="Mot de passe"
            @keyup.enter.native="tryToLogIn"
          />
        </b-field>
        <b-tag
          v-if="authError"
          type="is-danger"
          attached
          closable
          close-type="is-danger"
          aria-close-label="Fermer"
          @close="authError = null"
        >
          L'identifiant semble erroné
        </b-tag>
        <b-button
          :disabled="loggingIn || incomplete"
          size="is-medium"
          :class="$style.submitButton"
          @click="tryToLogIn"
        >
          <BaseIcon v-if="loggingIn" name="fan" spin />
          <span v-else>
            Se connecter
          </span>
        </b-button>
      </form>
    </div>
  </Layout>
</template>

<style lang="scss" module>
@import '@design';

.loginBox {
  @media screen and (min-width: $size-content-width-min) {
    @include embossed_paper_shadow(3);

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    max-width: $size-content-width-min;
    // padding: 2rem;
    margin: 0 auto 2rem;
    overflow: hidden;
    border-radius: 8px;
  }

  .form {
    width: 100%;
    padding: 3rem;
    .title {
      margin-bottom: 1rem;
      text-align: center;
    }
    .input {
      color: black;
    }
    .submitButton {
      display: block;
      margin: 2rem auto 0;
      text-align: center;
    }
  }
}
</style>
