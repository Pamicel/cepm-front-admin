<script>
// import BookingDetails from '@components/booking-details.vue'

export default {
  // components: { BookingDetails },
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
  },
  methods: {
    toggleDetails(row) {
      if (this.opened.includes(row.groupNumber)) {
        this.opened = this.opened.filter((gn) => gn !== row.groupNumber)
      } else {
        this.opened = [...this.opened, row.groupNumber]
      }
    },
  },
}
</script>

<template>
  <div>
    <b-table
      :data="groups"
      :loading="isLoading"
      striped
      mobile-cards
      sort-icon="arrow-up"
      detail-key="groupNumber"
    >
      <template slot-scope="props">
        <b-table-column
          field="bookerEmail"
          label="Email de réservation"
          sortable
        >
          <span aria-role="button" role="button">
            {{ props.row.bookerEmail }}
          </span>
        </b-table-column>

        <b-table-column
          field="numberOfBookings"
          label="passager·ère(s)"
          sortable
          numeric
        >
          <span
            :class="$style.numberOfBookings"
            aria-role="button"
            role="button"
          >
            {{ props.row.numberOfBookings }}
          </span>
        </b-table-column>

        <b-table-column
          field="emailed"
          label="Notification email"
          boolean
          sortable
        >
          <span v-if="props.row.emailed" class="tag is-success">
            Email envoyé
          </span>
          <b-taglist v-else-if="props.row.emailing" attached>
            <span class="tag is-danger">
              Email non envoyé :
            </span>
            <span class="tag is-warning">
              <BaseIcon :class="$style.loadingIcon" name="fan" spin />
            </span>
          </b-taglist>
          <b-taglist v-else attached>
            <span class="tag is-danger">
              Email non envoyé :
            </span>
            <span
              class="tag is-warning"
              role="button"
              :class="$style.sendButton"
              @click="$emit('sendEmail', props.row.bookerEmail)"
            >
              envoyer
            </span>
          </b-taglist>
        </b-table-column>
      </template>

      <!-- <template
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
          :initial-state="
            props.row.bookings.length === 1 ? 'is-open' : 'is-closed'
          "
        />
        </div>
      </template> -->

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

.groupNumber {
  opacity: 0.7;
}
.deathNumber {
  font-family: monospace;
  font-weight: bold;
}
.searchField {
  width: 80%;
}

.sendButton {
  cursor: pointer;
}
</style>
