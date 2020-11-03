<script>
export default {
  props: {
    bookings: {
      type: Array,
      default: () => [],
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      opened: [],
    }
  },
  computed: {
    isEmpty() {
      return this.bookings.length === 0
    },
    parsedBookings() {
      return this.bookings.map((booking) => {
        const parsedRaw = JSON.parse(booking.raw)
        const tableRaw = Object.entries(parsedRaw)
          .filter(([key, value]) => value)
          .map(([key, value]) => ({
            key,
            value,
          }))
        return {
          ...booking,
          parsedRaw,
          tableRaw,
        }
      })
    },
  },
}
</script>

<template>
  <b-table
    :data="isEmpty ? [] : parsedBookings"
    :loading="isLoading"
    striped
    mobile-cards
    sort-icon="arrow-up"
    :opened-detailed="opened"
    detailed
    detail-key="id"
    show-detail-icon
  >
    <template slot-scope="props">
      <b-table-column field="id" label="ID" width="40" sortable numeric>
        {{ props.row.id }}
      </b-table-column>

      <b-table-column field="bookerEmail" label="Email de réservation" sortable>
        {{ props.row.bookerEmail }}
      </b-table-column>

      <b-table-column field="deathNumber" label="Dossier Mortem" sortable>
        {{ props.row.deathNumber }}
      </b-table-column>

      <b-table-column
        field="importDate"
        label="Date d'import"
        centered
        date
        sortable
      >
        <span v-if="props.row.importDate">
          {{ new Date(props.row.importDate).toLocaleDateString() }}
        </span>
        <span v-else class="tag is-warning">
          N/A
        </span>
      </b-table-column>

      <b-table-column field="emailed" label="Email envoyé" boolean sortable>
        <span v-if="props.row.emailed" class="tag is-success">
          Oui
        </span>
        <span v-else class="tag is-warning">
          Non
        </span>
      </b-table-column>
    </template>

    <template
      slot="detail"
      slot-scope="props"
      field="tableRaw"
      mobile-cards
      sort-icon="arrow-up"
    >
      <b-table :data="props.row.tableRaw">
        <template slot-scope="table">
          <b-table-column field="key" label="Champ" sortable>{{
            table.row.key
          }}</b-table-column>
          <b-table-column field="value" label="Valeur" sortable>{{
            table.row.value
          }}</b-table-column>
        </template>
      </b-table>
    </template>

    <template slot="empty">
      <section class="section">
        <div class="content has-text-grey has-text-centered">
          <p>
            <b-icon icon="ticket-alt" size="is-large"> </b-icon>
          </p>
          <p>Aucune reservation.</p>
        </div>
      </section>
    </template>
  </b-table>
</template>

<style lang="scss" module>
@import '@design';
</style>
