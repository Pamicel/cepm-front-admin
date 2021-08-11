<script>
import formatHour from '@utils/format-hour.js'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import CrossingInfos from '@components/crossing-infos.vue'
import { mapState } from 'vuex'

export default {
  components: { CrossingInfos },
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
  data() {
    return {
      dateAsc: true,
    }
  },
  computed: {
    isEmpty() {
      return this.performances.length === 0
    },
    ...mapState({
      fetchingCrossings: (state) => state.crossings.fetchingCrossings,
      modifyingCrossing: (state) => state.crossings.modifyingCrossing,
    }),
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
    clickRow(crossingId) {
      this.$emit('select', crossingId)
    },
    endTime(startDate, duration) {
      const endDate = new Date(startDate.getTime() + duration * 60 * 1000)
      return endDate
    },
    formatDate(date) {
      return format(new Date(date), "d MMM yyyy, H'h'mm", { locale: fr })
    },
    changeCrossingsOrder() {
      this.dateAsc = !this.dateAsc
    },
    archive(crossing) {
      this.$store.dispatch('crossings/modifyCrossing', {
        id: crossing.id,
        changes: {
          archived: !crossing.archived,
        },
      })
    },
  },
}
</script>

<template>
  <div :class="$style.container">
    <div :class="$style.idcOrderButton">
      <b-button type="is-dark" @click="changeCrossingsOrder">
        Date
        <span :data-state="dateAsc ? 'ASC' : 'DESC'" :class="$style.orderArrow"
          >↓</span
        >
      </b-button>
    </div>
    <div
      v-for="crossing of [...performances].sort(
        (ca, cb) => (dateAsc ? -1 : 1) * (ca.startDate > cb.startDate ? 1 : -1)
      )"
      :key="crossing.id"
      :class="$style.infos"
    >
      <CrossingInfos
        :crossing="crossing"
        small
        :loading="fetchingCrossings || modifyingCrossing"
        selectable
        @select="() => clickRow(crossing.id)"
        @archive="() => archive(crossing)"
      />
    </div>
  </div>
  <!-- <b-table
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
  </b-table> -->
</template>

<style lang="scss" module>
@import '@design';

.container {
  .infos {
    margin-top: 0.5rem;
  }
  .orderArrow {
    display: inline-block;
    font-weight: bold;
    transition: all 200ms;
    &[data-state='ASC'] {
      transform: rotate(180deg);
    }
  }
}
</style>
