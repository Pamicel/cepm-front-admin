<script>
import Layout from '@layouts/local.vue'
import { mapState } from 'vuex'

export default {
  page() {
    return {
      title: "Profil d'utilisateur",
      meta: [
        {
          name: 'description',
          content: `The user profile for ${this.user.id}.`,
        },
      ],
    }
  },
  components: { Layout },
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    const roleTranslations = {
      admin: 'Admin',
      director: 'Mise en scène',
      staff: 'Staff',
    }

    return {
      roleTranslations,
      oldPwd: '',
      newPwd: '',
      newPwdRepeat: '',
      pwdFormLengthError: false,
      pwdFormRepeatError: false,
    }
  },
  computed: {
    ...mapState({
      changingPassword: (state) => state.auth.changingPassword,
    }),
    pwdFormComplete() {
      return (
        this.oldPwd !== '' && this.newPwd !== '' && this.newPwdRepeat !== ''
      )
    },
  },
  methods: {
    validatePwdForm() {
      const passwordCorrectLen = this.newPwd.length > 8
      const passwordsMatch = this.newPwd === this.newPwdRepeat
      if (!passwordCorrectLen) {
        this.pwdFormLengthError = true
      }
      if (!passwordsMatch) {
        this.pwdFormRepeatError = true
      }

      return passwordCorrectLen && passwordsMatch
    },
    async sendNewPassword() {
      if (!this.validatePwdForm()) {
        return null
      }

      const {
        newPwd: newPassword,
        oldPwd: oldPassword,
        user: { id: userId },
      } = this

      if (
        await this.$store.dispatch('auth/changePassword', {
          newPassword,
          oldPassword,
          userId,
        })
      ) {
        this.$buefy.toast.open({
          duration: 5000,
          message: 'Le mot de passe a été mis à jour',
          position: 'is-bottom',
          type: 'is-success',
        })
        this.oldPwd = ''
        this.newPwd = ''
        this.newPwdRepeat = ''
      } else {
        this.$buefy.toast.open({
          duration: 5000,
          message:
            'Une erreur est survenue lors de la mise à jour du mot de passe',
          position: 'is-bottom',
          type: 'is-danger',
        })
      }
    },
  },
}
</script>

<template>
  <Layout>
    <div :class="$style.container">
      <h1> #{{ user.id }} </h1>
      <h2 :class="$style.email">
        {{ user.email }}
      </h2>
      <p>
        Créé le
        {{ new Date(user.dateCreated).toLocaleDateString() }}</p
      >
      <hr />

      <div :class="$style.role" role="button">
        <div :class="$style.roleDisplay">
          <b-tag
            v-if="user.auth.role === 'director'"
            type="is-success"
            rounded
            size="is-medium"
            >{{ roleTranslations.director }}</b-tag
          >
          <b-tag
            v-else-if="user.auth.role === 'admin'"
            type="is-danger"
            rounded
            size="is-medium"
            >{{ roleTranslations.admin }}</b-tag
          >
          <b-tag v-else rounded type="is-info" size="is-medium">{{
            roleTranslations.staff
          }}</b-tag>
        </div>
        <hr />
        <div>
          <h3 :class="$style.fieldTitle">Changer de mot de passe</h3>
          <br />
          <b-field label="Ancien mot de passe">
            <b-input
              v-model="oldPwd"
              type="password"
              :disabled="changingPassword"
              :loading="changingPassword"
            ></b-input>
          </b-field>
          <br />
          <b-field
            label="Nouveau mot de passe"
            :type="pwdFormLengthError ? 'is-danger' : ''"
            message="Minimum 9 caratères"
          >
            <b-input
              v-model="newPwd"
              type="password"
              :disabled="changingPassword"
              :loading="changingPassword"
            ></b-input>
          </b-field>
          <b-field
            label="Répéter le nouveau mot de passe"
            :type="pwdFormRepeatError ? 'is-danger' : ''"
            :message="
              pwdFormRepeatError ? 'Les mots de passe ne correspondent pas' : ''
            "
          >
            <b-input
              v-model="newPwdRepeat"
              type="password"
              :disabled="changingPassword"
              :loading="changingPassword"
            ></b-input>
          </b-field>
          <br />
          <div :class="$style.fieldButton">
            <b-button
              :disabled="!pwdFormComplete || changingPassword"
              :loading="changingPassword"
              type="is-info"
              rounded
              @click="sendNewPassword"
              >Changer</b-button
            >
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<style lang="scss" module>
@import '@design';

.container {
  width: $size-content-width-min;
  margin: auto;

  .email {
    @extend %typography-large;
  }

  .fieldTitle {
    @extend %typography-medium;
  }

  .fieldButton {
    text-align: right;
  }

  .role {
    margin-top: 8px;
  }
}
</style>
