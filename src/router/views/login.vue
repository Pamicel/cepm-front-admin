<script>
import Layout from '@layouts/local.vue'
import { authMethods } from '@state/helpers'
import appConfig from '@src/app.config'

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
      tryingToLogIn: false,
    }
  },
  computed: {
    placeholders() {
      return process.env.NODE_ENV === 'production'
        ? {}
        : {
            email: 'Email',
            password: 'Password',
          }
    },
  },
  methods: {
    ...authMethods,
    // Try to log the user in with the email
    // and password they provided.
    tryToLogIn() {
      this.tryingToLogIn = true
      // Reset the authError if it existed.
      this.authError = null
      return this.logIn({
        email: this.email,
        password: this.password,
      })
        .then((token) => {
          this.tryingToLogIn = false

          // Redirect to the originally requested page, or to the home page
          this.$router.push(this.$route.query.redirectFrom || { name: 'home' })
        })
        .catch((error) => {
          this.tryingToLogIn = false
          this.authError = error
        })
    },
  },
}
</script>

<template>
  <Layout narrow>
    <form :class="$style.form" @submit.prevent="tryToLogIn">
      <h1>Se connecter</h1>
      <BaseInputText
        v-model="email"
        :class="$style.input"
        name="email"
        :placeholder="placeholders.email"
      />
      <BaseInputText
        v-model="password"
        :class="$style.input"
        name="password"
        type="password"
        :placeholder="placeholders.password"
      />
      <BaseButton :disabled="tryingToLogIn" type="submit">
        <BaseIcon v-if="tryingToLogIn" name="sync" spin />
        <span v-else>
          Log in
        </span>
      </BaseButton>
      <p v-if="authError">
        There was an error logging in to your account.
      </p>
    </form>
  </Layout>
</template>

<style lang="scss" module>
@import '@design';

.form {
  text-align: center;
  .input {
    color: black;
  }
}
</style>
