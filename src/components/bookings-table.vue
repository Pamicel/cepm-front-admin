<script>
import BookingDetails from '@components/booking-details.vue'

export default {
  components: { BookingDetails },
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
      searchString: '',
    }
  },
  computed: {
    searchResult(state) {
      if (state.searchString === '') {
        return state.bookings
      }

      const removeDiatrics = (str) =>
        str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      const simplified = (str) => removeDiatrics(str.toLowerCase())

      const searchString = removeDiatrics(state.searchString)

      return state.bookings.filter((booking) => {
        const rawValues = Object.values(booking.parsedRaw).join(' ')
        const toSearch = `${rawValues} ${booking.groupNumber} ${booking.fullDeathNumber}`

        return simplified(toSearch).includes(simplified(searchString))
      })
    },
  },
  methods: {
    toggleDetails(row) {
      if (this.opened.includes(row.id)) {
        this.opened = this.opened.filter((gn) => gn !== row.id)
      } else {
        this.opened = [...this.opened, row.id]
      }
    },
  },
}
</script>

<template>
  <div>
    <b-input
      v-model="searchString"
      :class="$style.searchField"
      icon="search"
      type="text"
    />
    <b-table
      :data="searchResult"
      :loading="isLoading"
      striped
      mobile-cards
      sort-icon="arrow-up"
      sort-icon-size="is-small"
      :opened-detailed="opened"
      detailed
      narrowed
      detail-key="id"
    >
      <template slot-scope="props">
        <b-table-column
          field="present"
          label="Présence"
          sortable
          boolean
          centered
        >
          <span
            :class="[$style.present, $style.clickableText]"
            aria-role="button"
            role="button"
            @click="toggleDetails(props.row)"
          >
            <span v-if="props.row.present" class="tag is-small is-success"
              ><BaseIcon name="check"
            /></span>
            <span v-else class="tag is-small"
              ><BaseIcon :class="$style.notOk" name="times"
            /></span>
          </span>
        </b-table-column>

        <b-table-column
          field="fullDeathNumber"
          label="Décédé·e numéro"
          sortable
        >
          <span
            :class="$style.clickableText"
            aria-role="button"
            role="button"
            @click="toggleDetails(props.row)"
          >
            <b-tag type="is-dark" :class="$style.deathNumber">
              {{ props.row.fullDeathNumber }}
            </b-tag>
          </span>
        </b-table-column>

        <b-table-column field="hasFirm" label="FIRM" sortable boolean>
          <span
            :class="[$style.present, $style.clickableText]"
            aria-role="button"
            role="button"
            @click="toggleDetails(props.row)"
          >
            <span v-if="!props.row.hasFirm" class="tag is-small is-danger"
              >Pas de FIRM</span
            >
            <span
              v-else-if="props.row.hasFirm && props.row.filled"
              class="tag is-small is-success"
              >FIRM complet</span
            >
            <span v-else class="tag is-small is-info">Firm associé</span>
          </span>
        </b-table-column>

        <b-table-column
          field="bookerEmail"
          label="Email de réservation"
          sortable
        >
          <span
            :class="[$style.bookerEmail, $style.clickableText]"
            aria-role="button"
            role="button"
            @click="toggleDetails(props.row)"
          >
            {{ props.row.bookerEmail }}
          </span>
        </b-table-column>
      </template>

      <template
        slot="detail"
        slot-scope="props"
        field="bookings"
        mobile-cards
        sort-icon="arrow-up"
      >
        <BookingDetails :key="props.row.deathNumber" :booking="props.row" />
      </template>

      <template slot="empty">
        <section class="section">
          <div class="content has-text-grey has-text-centered">
            <p>
              <b-icon icon="ticket-alt" size="is-large"> </b-icon>
            </p>
            <p>Aucune réservation.</p>
          </div>
        </section>
      </template>
    </b-table>
  </div>
</template>

<style lang="scss" module>
@import '@design';
.groupNumber {
  opacity: 0.7;
}
.deathNumber {
  font-family: monospace;
}
.notOk {
  color: $color-danger;
}
.searchField {
  width: 80%;
  margin: 1rem auto 2rem;
}

.clickableText {
  cursor: pointer;
}
</style>
