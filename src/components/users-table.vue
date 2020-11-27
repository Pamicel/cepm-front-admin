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
    sortStringDates(rowA, rowB, isAsc) {
      try {
        const dateA = new Date(rowA.dateCreated).getDate()
        const dateB = new Date(rowB.dateCreated).getDate()

        return isAsc ? dateB - dateA : dateA - dateB
      } catch (error) {
        return 1
      }
    },
    sortTranslatedRoles(rowA, rowB, isAsc) {
      try {
        const roleA = this.translateRole(rowA.auth.role)
        const roleB = this.translateRole(rowB.auth.role)

        return isAsc ? roleB < roleA || -1 : roleA < roleB || -1
      } catch (error) {
        return 1
      }
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
          return 'Visiteur·rice'
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
    :class="$style.table"
    @click="clickRow"
  >
    <template slot-scope="props">
      <b-table-column
        :class="$style.row"
        field="id"
        label="Numéro"
        width="40"
        numeric
        sortable
      >
        {{ props.row.id }}
      </b-table-column>

      <b-table-column
        :class="$style.row"
        field="date"
        label="Date d'inscription"
        centered
        sortable
        :custom-sort="sortStringDates"
      >
        <span>
          {{ new Date(props.row.dateCreated).toLocaleDateString() }}
        </span>
      </b-table-column>

      <b-table-column
        :class="$style.row"
        field="role"
        label="Role"
        centered
        sortable
        :custom-sort="sortTranslatedRoles"
      >
        {{ translateRole(props.row.auth.role) }}
      </b-table-column>

      <b-table-column
        :class="$style.row"
        field="email"
        label="Email"
        centered
        sortable
      >
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

.table {
  .row {
    cursor: pointer;
  }
}
</style>
