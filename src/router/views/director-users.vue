<script>
import Layout from '@layouts/local.vue'
import DirectorUsersTable from '@components/director-users-table.vue'
import { mapState } from 'vuex'
import { PERMISSION_LEVELS } from '@state/modules/auth'

export default {
  page: {
    title: 'Utilisateurs',
    meta: [{ name: 'description', content: 'Tous les utilisateurs.' }],
  },
  components: { Layout, DirectorUsersTable },
  data() {
    return {
      formOpen: false,
      showVisitors: true,
      showStaff: false,
      showNoEmail: false,
    }
  },
  computed: {
    ...mapState({
      userList: (state) => state.users.userList,
      fetchingUsers: (state) => state.users.fetchingUsers,
      creatingUser: (state) => state.users.creatingUser,
    }),
    displayedUsers: (state) => {
      const { userList, showVisitors, showStaff, showNoEmail } = state
      if (!showVisitors || !showStaff || !showNoEmail) {
        return userList
          .filter((user) => {
            if (!showVisitors) {
              return user.permissionLevel > PERMISSION_LEVELS.USER
            }
            return true
          })
          .filter((user) => {
            if (!showStaff) {
              return user.permissionLevel <= PERMISSION_LEVELS.USER
            }
            return true
          })
          .filter((user) => {
            if (!showNoEmail) {
              return !!user.email
            }
            return true
          })
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

      <div :class="$style.tableControl">
        <b-switch v-model="showVisitors">
          Montrer les visiteur·rice·s
        </b-switch>
        <br />
        <b-switch v-model="showStaff">
          Montrer le staff
        </b-switch>
        <br />
        <b-switch v-model="showNoEmail">
          Montrer les utilisateurs sans email
        </b-switch>
      </div>

      <DirectorUsersTable
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
