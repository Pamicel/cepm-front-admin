<script>
import Layout from '@layouts/local.vue'
import { mapState } from 'vuex'
import { PERMISSION_LEVELS } from '@state/modules/auth'
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
  data() {
    const roleTranslations = {
      [PERMISSION_LEVELS.ADMIN]: 'Admin',
      [PERMISSION_LEVELS.DIRECTOR]: 'Direction',
      [PERMISSION_LEVELS.STAFF]: 'Staff',
      [PERMISSION_LEVELS.USER]: 'Visiteur·rice',
    }

    return {
      roleChangeSelection: null,
      roleTranslations,
      oldPwd: '',
      newPwd: '',
      newPwdRepeat: '',
      PERMISSION_LEVELS,
    }
  },
  computed: {
    isUpdatingRole() {
      return this.$store.getters['users/isUpdatingUserRole'](this.user.id)
    },
    ...mapState({
      user: (state) => state.users.selectedUser,
      deletingUser: (state) => state.users.deletingUser,
    }),
    isAdmin() {
      return this.user.permissionLevel === PERMISSION_LEVELS.ADMIN
    },
    isDirector() {
      return this.user.permissionLevel === PERMISSION_LEVELS.DIRECTOR
    },
    isStaff() {
      return this.user.permissionLevel === PERMISSION_LEVELS.STAFF
    },
    isUser() {
      return this.user.permissionLevel === PERMISSION_LEVELS.USER
    },
  },
  methods: {
    roleChangeSender(userId, permissionLevel) {
      return async () => {
        const response = await this.$store.dispatch('users/updateUserRole', {
          userId,
          permissionLevel,
        })
        if (response) {
          this.$buefy.toast.open({
            duration: 3000,
            message: "Le role de l'utilisateur à été modifié",
            type: 'is-success',
          })
        } else {
          this.$buefy.toast.open({
            duration: 3000,
            message: "Erreur API: l'utilisateur n'a pas été modifié",
            type: 'is-warning',
          })
        }
      }
    },
    updateRole() {
      const { roleChangeSelection: permissionLevel, user } = this

      if (!permissionLevel) {
        this.$buefy.dialog.alert({
          message: 'Veuillez selectionner un rôle',
          title: 'Changement de rôle',
        })
      } else if (user.permissionLevel === permissionLevel) {
        // If already user permissionLevel -> dialog saying so
        this.$buefy.dialog.alert({
          message: `"${this.roleTranslations[permissionLevel]}" est déjà le rôle de cet·te utilisateur·rice.`,
          title: 'Changement de rôle',
        })
      } else {
        // Otherwise -> confirmation dialog
        this.$buefy.dialog.confirm({
          message: `Êtes-vous sûr·e de vouloir donner à cet·te utilisateur·rice le rôle "${this.roleTranslations[permissionLevel]}" .`,
          title: 'Changement de rôle',
          confirmText: 'Oui',
          onConfirm: this.roleChangeSender(user.id, permissionLevel),
          cancelText: 'Annuler',
          type: 'is-danger',
        })
      }
    },

    async deleteUser() {
      const { id: userId } = this.user
      const response = await this.$store.dispatch('users/deleteUser', {
        userId,
      })
      if (response) {
        this.$buefy.toast.open({
          duration: 3000,
          message: "L'utilisateur a été supprimé",
          type: 'is-warning',
        })
        this.$router.push({ name: 'users' })
      } else {
        this.$buefy.dialog.alert({
          duration: 3000,
          title: 'Erreur',
          message: 'Échec de la suppression',
          type: 'is-danger',
        })
      }
    },
    deleteUserConfirm() {
      const deleteIfCorrectId = (userId) => {
        if (parseInt(this.user.id) === parseInt(userId)) {
          this.deleteUser()
        } else {
          return this.$buefy.dialog.alert({
            duration: 3000,
            title: 'Erreur',
            message: "L'identifiant est incorrect",
            type: 'is-danger',
          })
        }
      }

      this.$buefy.dialog.prompt({
        title: `Supprimer l'utilisateur #${this.user.id}`,
        message:
          "Entrez l'identifiant de l'utilisateur pour confirmer la suppression",
        confirmText: "Supprimer l'utilisateur",
        onConfirm: deleteIfCorrectId,
        cancelText: 'Annuler',
        type: 'is-danger',
        inputAttrs: {
          placeholder: 'Identifiant',
          prefix: '#',
        },
      })
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
          <b-tag v-if="isDirector" type="is-success" rounded size="is-medium">{{
            roleTranslations[PERMISSION_LEVELS.DIRECTOR]
          }}</b-tag>
          <b-tag
            v-else-if="isAdmin"
            type="is-danger"
            rounded
            size="is-medium"
            >{{ roleTranslations[PERMISSION_LEVELS.ADMIN] }}</b-tag
          >
          <b-tag v-else-if="isStaff" rounded type="is-info" size="is-medium">{{
            roleTranslations[PERMISSION_LEVELS.STAFF]
          }}</b-tag>

          <b-tag v-else rounded type="is-warning" size="is-medium">{{
            roleTranslations[PERMISSION_LEVELS.USER]
          }}</b-tag>
        </div>

        <br />

        <div v-if="!isAdmin" :class="$style.roleChange">
          <h3>Changer de rôle</h3>
          <b-field>
            <b-select
              v-model="roleChangeSelection"
              :placeholder="roleTranslations[user.permissionLevel]"
              rounded
              :disabled="isUpdatingRole"
            >
              <option
                :disabled="isDirector"
                :value="PERMISSION_LEVELS.DIRECTOR"
                >{{ roleTranslations[PERMISSION_LEVELS.DIRECTOR] }}</option
              >
              <option :disabled="isStaff" :value="PERMISSION_LEVELS.STAFF">{{
                roleTranslations[PERMISSION_LEVELS.STAFF]
              }}</option>
              <option :disabled="isUser" :value="PERMISSION_LEVELS.USER">{{
                roleTranslations[PERMISSION_LEVELS.USER]
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

      <hr />
      <div :class="$style.deleteUser">
        <b-button
          v-if="!isAdmin"
          type="is-danger"
          rounded
          :disabled="deletingUser || isAdmin"
          :loading="deletingUser"
          @click="deleteUserConfirm"
          >Supprimer l'utilisateur</b-button
        >
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
