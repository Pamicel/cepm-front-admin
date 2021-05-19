<script>
import { PERMISSION_LEVELS } from '@state/modules/auth'

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
        const roleA = this.translateRole(rowA.permissionLevel)
        const roleB = this.translateRole(rowB.permissionLevel)

        return isAsc ? roleB < roleA || -1 : roleA < roleB || -1
      } catch (error) {
        return 1
      }
    },
    translateRole(level) {
      switch (level) {
        case PERMISSION_LEVELS.ADMIN:
          return 'Admin'
        case PERMISSION_LEVELS.DIRECTOR:
          return 'Direction'
        case PERMISSION_LEVELS.STAFF:
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
        field="permissionLevel"
        label="Role"
        centered
        sortable
        :custom-sort="sortTranslatedRoles"
      >
        {{ translateRole(props.row.permissionLevel) }}
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
