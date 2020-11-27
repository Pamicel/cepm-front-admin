<script>
import Layout from '@layouts/local.vue'
import UsersTable from '@components/users-table.vue'
import UserCreationForm from '@components/user-creation-form.vue'
import { mapState } from 'vuex'

export default {
  page: {
    title: 'Utilisateurs',
    meta: [{ name: 'description', content: 'Tous les utilisateurs.' }],
  },
  components: { Layout, UsersTable, UserCreationForm },
  data() {
    return {
      formOpen: false,
      showVisitors: false,
      showStaff: true,
    }
  },
  computed: {
    ...mapState({
      userList: (state) => state.users.userList,
      fetchingUsers: (state) => state.users.fetchingUsers,
      creatingUser: (state) => state.users.creatingUser,
    }),
    displayedUsers: (state) => {
      const { userList, showVisitors, showStaff } = state
      if (!showVisitors || !showStaff) {
        return userList.filter(
          (user) =>
            (showVisitors ||
              (user.auth.role !== 'visitor' && user.auth.role !== undefined)) &&
            (showStaff ||
              (user.auth.role !== 'staff' &&
                user.auth.role !== 'admin' &&
                user.auth.role !== 'director'))
        )
      }
      return userList
    },
  },
  mounted() {
    this.$store.dispatch('users/fetchUsers')
  },
  methods: {
    async createUser(user) {
      const newUser = await this.$store.dispatch('users/createUser', user)
      if (newUser) {
        await this.$store.dispatch('users/fetchUsers')
      }
    },
    toggleModal() {
      this.formOpen = !this.formOpen
    },
    selectUser(userId) {
      this.$emit('users/selectUser', userId)
      this.$router.push({ name: 'single-user', params: { id: userId } })
    },
  },
}
</script>

<template>
  <Layout>
    <div :class="$style.container">
      <h1 :class="$style.title">
        Utilisateurs
      </h1>

      <div :class="[$style.creation, formOpen ? $style.creationOpen : '']">
        <b-collapse :open.sync="formOpen">
          <BaseButton
            slot="trigger"
            :class="[
              $style.createButton,
              formOpen ? $style.createButtonOpen : '',
            ]"
          >
            + Créer un utilisateur
          </BaseButton>
          <div :class="$style.creationFormContainer">
            <UserCreationForm @send="createUser" @cancel="toggleModal" />
          </div>
        </b-collapse>
      </div>

      <div :class="$style.tableControl">
        <b-switch v-model="showVisitors">
          Montrer les visiteur·rice·s
        </b-switch>
        <br />
        <b-switch v-model="showStaff">
          Montrer le staff
        </b-switch>
      </div>

      <UsersTable
        :class="$style.usersTable"
        :users="displayedUsers"
        :is-loading="fetchingUsers || creatingUser"
        @select="selectUser"
      />
    </div>
  </Layout>
</template>

<style lang="scss" module>
@import '@design';

.container {
  @extend %narrow-content;

  .creation {
    // width: fit-content;
    width: 100%;
    transition: all 200ms;
    .creationForm {
      width: fit-content;
    }
    &.creationOpen {
      @include box_shadow(1);

      padding: 1rem;
      margin: 0 0 1rem 0;
      background-color: #fff;
      border: 1px solid lightgrey;
      border-radius: 4px;
    }

    .createButton {
      @extend %typography-medium;

      padding: 0;
      margin: 0 0 1rem;
      background-color: transparent;
      border-bottom: 0.1em solid transparent;
      transition: all 100ms;
      &:hover {
        border-color: black;
      }
      &.createButtonOpen {
        @extend %typography-large;
      }
    }
  }

  .tableControl {
    margin: 0 1rem 1rem;
  }

  .title {
    margin-bottom: 1rem;
  }

  .usersTable {
    border-right: 5px solid black;
    border-left: 5px solid black;
    border-radius: 4px;
  }
}
</style>
