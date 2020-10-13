<script>
export default {
  props: {
    users: {
      type: Array,
      default: () => [],
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    isEmpty() {
      return this.users.length === 0
    },
  },
  methods: {
    clickRow(row) {
      this.$emit('select', row.id)
    },
    translateRole(role) {
      switch (role) {
        case 'admin':
          return 'Admin'
        case 'director':
          return 'Mise en scène'
        case 'staff':
          return 'Staff'
        default:
          return 'Pas de rôle'
      }
    },
  },
}
</script>

<template>
  <b-table
    :data="isEmpty ? [] : users"
    :loading="isLoading"
    striped
    hoverable
    mobile-cards
    @click="clickRow"
  >
    <template slot-scope="props">
      <b-table-column field="id" label="Numéro" width="40" numeric>
        {{ props.row.id }}
      </b-table-column>

      <b-table-column field="date" label="Date d'inscription" centered>
        <span>
          {{ new Date(props.row.dateCreated).toLocaleDateString() }}
        </span>
      </b-table-column>

      <b-table-column field="role" label="Role" centered>
        {{ translateRole(props.row.auth.role) }}
      </b-table-column>

      <b-table-column field="email" label="Email" centered>
        {{ props.row.email }}
      </b-table-column>
    </template>

    <template slot="empty">
      <section class="section">
        <div class="content has-text-grey has-text-centered">
          <p>
            <b-icon icon="emoticon-sad" size="is-large"> </b-icon>
          </p>
          <p>Aucun utilisateur.</p>
        </div>
      </section>
    </template>
  </b-table>
</template>

<style lang="scss" module>
@import '@design';
</style>
