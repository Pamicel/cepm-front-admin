<script>
import formatHour from '@utils/format-hour.js'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

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
  methods: {
    formatHour,
    duration(duration) {
      const hourInMinutes = 60
      const dayInMinutes = 60 * 24

      if (duration >= hourInMinutes) {
        const hours = Math.floor((duration % dayInMinutes) / hourInMinutes)
        const minutes = `${duration % hourInMinutes}`.padStart(2, '0')

        return `${hours}h${minutes}min`
      }

      return `${duration}min`
    },
    clickRow(row) {
      this.$emit('select', row.id)
    },
    endTime(startDate, duration) {
      const endDate = new Date(startDate.getTime() + duration * 60 * 1000)
      return endDate
    },
    formatDate(date) {
      return format(new Date(date), "d MMM yyyy, H'h'mm", { locale: fr })
    },
  },
}
</script>

<template>
  <b-table
    :data="isEmpty ? [] : performances"
    :loading="isLoading"
    :default-sort="['startDate', 'DESC']"
    striped
    hoverable
    mobile-cards
    @click="clickRow"
  >
    <template slot-scope="props">
      <b-table-column
        :class="$style.col"
        field="crossingNumber"
        label="Numéro"
        width="40"
        numeric
      >
        {{ new Intl.NumberFormat('fr-FR').format(props.row.crossingNumber) }}
      </b-table-column>

      <b-table-column
        :class="$style.col"
        field="startDate"
        label="Date"
        centered
        sortable
      >
        <span>
          {{ formatDate(props.row.startDate) }}
        </span>
      </b-table-column>

      <b-table-column
        :class="$style.col"
        field="audience"
        label="Jauge"
        centered
      >
        {{ props.row.audienceSize }}
      </b-table-column>

      <b-table-column :class="$style.col" field="hour" label="Début" centered>
        {{ formatHour(new Date(props.row.startDate)) }}
      </b-table-column>

      <b-table-column :class="$style.col" field="hour" label="Fin" centered>
        {{
          formatHour(endTime(new Date(props.row.startDate), props.row.duration))
        }}
      </b-table-column>

      <b-table-column
        :class="$style.col"
        field="duration"
        centered
        label="Durée"
      >
        {{ duration(props.row.duration) }}
      </b-table-column>

      <b-table-column
        :class="$style.col"
        field="archived"
        centered
        label="État"
      >
        <span v-if="props.row.archived"
          >Archivée <BaseIcon name="archive"
        /></span>
        <span v-else>Active</span>
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

.col {
  cursor: pointer;
}
</style>
