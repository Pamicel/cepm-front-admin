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
          content: `The user profile for user #${this.user.id}.`,
        },
      ],
    }
  },
  components: { Layout },
  // props: {
  //   user: {
  //     type: Object,
  //     required: true,
  //   },
  // },
  data() {
    const roleTranslations = {
      admin: 'Admin',
      director: 'Mise en scène',
      staff: 'Staff',
    }

    return {
      roleChangeSelection: null,
      roleTranslations,
      oldPwd: '',
      newPwd: '',
      newPwdRepeat: '',
    }
  },
  computed: {
    isUpdatingRole() {
      return this.$store.getters['users/isUpdatingUserRole'](this.user.id)
    },
    ...mapState({
      user: (state) => state.users.selectedUser,
    }),
  },
  methods: {
    roleChangeSender(userId, role) {
      return async () => {
        await this.$store.dispatch('users/updateUserRole', {
          userId,
          role,
        })
        this.$buefy.toast.open({
          duration: 3000,
          message: "Le role de l'utilisateur à été modifié",
          // position: 'is-bottom',
          type: 'is-success',
        })
      }
    },
    updateRole() {
      const { roleChangeSelection: role, user } = this

      if (!role) {
        this.$buefy.dialog.alert({
          message: 'Veuillez selectionner un rôle',
          title: 'Changement de rôle',
        })
      } else if (user.auth && user.auth.role === role) {
        // If already user role -> dialog saying so
        this.$buefy.dialog.alert({
          message: `"${this.roleTranslations[role]}" est déjà le rôle de cet utilisateur.`,
          title: 'Changement de rôle',
        })
      } else {
        // Otherwise -> confirmation dialog
        this.$buefy.dialog.confirm({
          message: `Êtes-vous sûr·e de vouloir donner à cet utilisateur le rôle "${this.roleTranslations[role]}" .`,
          title: 'Changement de rôle',
          confirmText: 'Oui',
          onConfirm: this.roleChangeSender(user.id, role),
          cancelText: 'Annuler',
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
      <div :class="$style.breadcrumb">
        <BaseLink name="users">
          ← Utilisateurs
        </BaseLink>
      </div>
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
        <div :class="$style.roleCurrent">
          <h3>Rôle:</h3>
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
          <b-tag
            v-else-if="user.auth.role === 'staff'"
            rounded
            type="is-info"
            size="is-medium"
            >{{ roleTranslations.staff }}</b-tag
          >

          <b-tag v-else rounded type="is-warning" size="is-medium"
            >Pas de rôle</b-tag
          >
        </div>

        <br />

        <div :class="$style.roleChange">
          <h3>Changer de rôle</h3>
          <b-field>
            <b-select
              v-model="roleChangeSelection"
              :placeholder="roleTranslations[user.auth.role]"
              rounded
              :disabled="isUpdatingRole"
            >
              <option :disabled="user.auth.role === 'admin'" value="admin">{{
                roleTranslations.admin
              }}</option>
              <option
                :disabled="user.auth.role === 'director'"
                value="director"
                >{{ roleTranslations.director }}</option
              >
              <option :disabled="user.auth.role === 'staff'" value="staff">{{
                roleTranslations.staff
              }}</option>
            </b-select>
            <p class="control">
              <b-button
                :disabled="isUpdatingRole"
                :loading="isUpdatingRole"
                type="is-info"
                rounded
                @click="updateRole"
                >Changer</b-button
              >
            </p>
          </b-field>
        </div>
      </div>
    </div>
  </Layout>
</template>

<style lang="scss" module>
@import '@design';

.container {
  .breadcrumb {
    margin-bottom: 1rem;
  }

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
    h3 {
      @extend %typography-medium;
    }
  }
}
</style>
