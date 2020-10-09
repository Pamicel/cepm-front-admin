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
      roleChangeOpen: false,
      roleChangeSelection: null,
      roleTranslations,
      oldPwd: '',
      newPwd: '',
      newPwdRepeat: '',
    }
  },
  computed: {
    ...mapState({
      currentUser: (state) => state.auth.currentUser,
      isChangingPassword: (state) => state.auth.isChangingPassword,
    }),
  },
  methods: {
    openRoleChange() {
      this.roleChangeOpen = true
    },
    closeRoleChange() {
      this.roleChangeOpen = false
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
        <div v-if="roleChangeOpen">
          <b-field v-model="roleChangeSelection">
            <b-select :placeholder="roleTranslations[user.auth.role]" rounded>
              <option value="admin">{{ roleTranslations.admin }}</option>
              <option value="director">{{ roleTranslations.director }}</option>
              <option value="staff">{{ roleTranslations.staff }}</option>
            </b-select>
            <p class="control">
              <b-button type="is-danger" rounded>Annuler</b-button>
            </p>
          </b-field>
        </div>
        <div v-else :class="$style.roleDisplay" @click="openRoleChange">
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
