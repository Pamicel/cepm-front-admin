<script>
import formatHour from '@utils/format-hour.js'

export default {
  props: {
    performances: {
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
      return this.performances.length === 0
    },
  },
  methods: { formatHour },
}
</script>

<template>
  <b-table
    :data="isEmpty ? [] : performances"
    :loading="isLoading"
    striped
    hoverable
    mobile-cards
  >
    <template slot-scope="props">
      <b-table-column field="id" label="ID" width="40" numeric>
        {{ props.row.id }}
      </b-table-column>

      <b-table-column field="duration" label="Durée">
        {{ props.row.duration }}
      </b-table-column>

      <b-table-column field="audience" label="Jauge">
        {{ props.row.audience }}
      </b-table-column>

      <b-table-column field="date" label="Date" centered>
        <span class="tag is-success">
          {{ new Date(props.row.date).toLocaleDateString() }}
        </span>
      </b-table-column>

      <b-table-column field="hour" label="Heure" centered>
        {{ formatHour(new Date(props.row.date)) }}
      </b-table-column>
    </template>

    <template slot="empty">
      <section class="section">
        <div class="content has-text-grey has-text-centered">
          <p>
            <b-icon icon="emoticon-sad" size="is-large"> </b-icon>
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
