<script>
import BookingDetails from '@components/booking-details.vue'

export default {
  components: { BookingDetails },
  props: {
    groups: {
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
      searchString: '',
    }
  },
  computed: {
    isEmpty() {
      return this.groups.length === 0
    },
    data() {
      if (this.isEmpty) {
        return []
      } else if (this.searchString) {
        return this.searchResult()
      }

      return this.groups
    },
  },
  methods: {
    searchResult() {
      if (this.searchString === '') {
        return this.groups
      }

      const removeDiatrics = (str) =>
        str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      const simplified = (str) => removeDiatrics(str.toLowerCase())

      const searchString = removeDiatrics(this.searchString)

      const match = []

      for (const group of this.groups) {
        const bookings = group.bookings.map((booking) => {
          const rawValues = Object.values(booking.parsedRaw).join(' ')
          const toSearch = `${rawValues} ${booking.groupNumber}`

          if (simplified(toSearch).includes(simplified(searchString))) {
            return {
              ...booking,
              match: true,
            }
          }

          return booking
        })

        if (bookings.filter((booking) => booking.match).length !== 0) {
          match.push({
            ...group,
            bookings,
          })
        }
      }

      return match
    },
  },
}
</script>

<template>
  <div>
    <h1 :class="$style.title">Réservations</h1>
    <b-input
      v-model="searchString"
      :class="$style.searchField"
      icon="search"
      type="text"
    />
    <b-table
      :data="data"
      :loading="isLoading"
      striped
      mobile-cards
      sort-icon="arrow-up"
      :opened-detailed="opened"
      detailed
      detail-key="groupNumber"
      show-detail-icon
    >
      <template slot-scope="props">
        <b-table-column field="numberOfBookings" label="Nombre" sortable>
          <span :class="$style.numberOfBookings">
            {{ props.row.numberOfBookings }}
          </span>
        </b-table-column>

        <b-table-column field="groupNumber" label="Dossier Mortem" sortable>
          <span :class="$style.groupNumber">
            {{ props.row.groupNumber }}
          </span>
        </b-table-column>

        <b-table-column
          field="bookerEmail"
          label="Email de réservation"
          sortable
        >
          {{ props.row.bookerEmail }}
        </b-table-column>

        <b-table-column field="emailed" label="Email envoyé" boolean sortable>
          <span v-if="props.row.emailed" class="tag is-success">
            Oui
          </span>
          <span v-else-if="props.row.emailing">
            <BaseIcon :class="$style.loadingIcon" name="fan" spin />
          </span>
          <b-button
            v-else
            type="is-warning"
            size="is-small"
            @click="$emit('sendEmail', props.row.bookerEmail)"
          >
            Non
          </b-button>
        </b-table-column>
      </template>

      <template
        slot="detail"
        slot-scope="props"
        field="bookings"
        mobile-cards
        sort-icon="arrow-up"
      >
        <BookingDetails
          v-for="booking of props.row.bookings"
          :key="booking.deathNumber"
          :booking="booking"
        />
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
  </div>
</template>

<style lang="scss" module>
@import '@design';
.title {
  text-align: center;
}

.groupNumber {
  opacity: 0.7;
}
.deathNumber {
  font-family: monospace;
  font-weight: bold;
}
.searchField {
  width: 80%;
  margin: 1rem auto 2rem;
}
</style>
