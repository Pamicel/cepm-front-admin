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
      director: 'Direction',
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
      deletingAccount: (state) => state.auth.deletingAccount,
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

    async deleteAccount(password) {
      const response = await this.$store.dispatch('auth/deleteAccount', {
        password,
      })
      if (response) {
        this.$buefy.toast.open({
          duration: 3000,
          message: 'Le compte a été supprimé',
          type: 'is-warning',
        })
        this.$router.push({ name: 'logout' })
      } else {
        this.$buefy.dialog.alert({
          duration: 3000,
          title: 'Erreur',
          message: `
              <p>La suppression du compte n'a pu avoir lieu.</p>
              <br/>
              <p>Vérifiez que vous êtes bien connecté·e à internet et réessayez.</p>
            `,
          type: 'is-danger',
        })
      }
    },
    deleteAccountAskPassword() {
      this.$buefy.dialog.prompt({
        message: 'Entrez votre mot de passe pour confirmer la suppression',
        title: 'Supprimer votre compte',
        confirmText: 'Supprimer le compte',
        onConfirm: this.deleteAccount,
        cancelText: 'Annuler',
        type: 'is-danger',
        inputAttrs: {
          type: 'password',
          placeholder: 'Mot de passe',
          message: 'Ne peut pas être vide',
        },
      })
    },
    deleteAccountConfirm() {
      this.$buefy.dialog.confirm({
        message: `
          <p>Êtes-vous sûr·e de vouloir supprimer votre compte ?</p>
          <br/>
          <p>Vous ne pourrez pas revenir en arrière, toutes les données associées au compte seront supprimées.</p>
        `,
        title: 'Supprimer votre compte',
        confirmText: 'Oui',
        onConfirm: this.deleteAccountAskPassword,
        cancelText: 'Annuler',
        type: 'is-danger',
      })
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
            v-if="user.auth && user.auth.role === 'director'"
            type="is-success"
            rounded
            size="is-medium"
            >{{ roleTranslations.director }}</b-tag
          >
          <b-tag
            v-else-if="user.auth && user.auth.role === 'admin'"
            type="is-danger"
            rounded
            size="is-medium"
            >{{ roleTranslations.admin }}</b-tag
          >
          <b-tag v-else rounded type="is-info" size="is-medium">{{
            roleTranslations.staff
          }}</b-tag>
        </div>
      </div>

      <hr />
      <div :class="$style.passwordChange">
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

      <hr />
      <div :class="$style.deleteAccount">
        <b-button
          type="is-danger"
          rounded
          :disabled="
            deletingAccount || (user.auth && user.auth.role === 'admin')
          "
          :loading="deletingAccount"
          @click="deleteAccountConfirm"
          >Supprimer mon compte</b-button
        >
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
