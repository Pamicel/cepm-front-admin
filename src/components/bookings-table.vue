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
  computed: {
    isEmpty() {
      return this.bookings.length === 0
    },
  },
}
</script>

<template>
  <b-table
    :data="isEmpty ? [] : bookings"
    :loading="isLoading"
    striped
    mobile-cards
    sort-icon="arrow-up"
  >
    <template slot-scope="props">
      <b-table-column field="id" label="ID" width="40" sortable numeric>
        {{ props.row.id }}
      </b-table-column>

      <b-table-column
        field="booking_number"
        label="Réservation"
        sortable
        numeric
      >
        {{ props.row.booking_number }}
      </b-table-column>

      <b-table-column field="birth_date" label="Date de naissance" centered>
        <span v-if="props.row.birth_date">
          {{ new Date(props.row.birth_date).toLocaleDateString() }}
        </span>
        <span v-else class="tag is-warning">
          N/A
        </span>
      </b-table-column>
    </template>

    <template slot="empty">
      <section class="section">
        <div class="content has-text-grey has-text-centered">
          <p>
            <b-icon icon="frown" size="is-large"> </b-icon>
          </p>
          <p>Aucune traversée.</p>
        </div>
      </section>
    </template>
  </b-table>
</template>

<style lang="scss" module>
@import '@design';
</style>
