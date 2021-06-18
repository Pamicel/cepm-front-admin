<script>
import { PERMISSION_LEVELS } from '@state/modules/auth'
import FormDisplay from '@components/form-display.vue'
import { getCrossingNumber } from '@utils/crossingNumber.js'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export default {
  components: { FormDisplay },
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
  data() {
    return {
      selectedDeath: null,
    }
  },
  computed: {
    isEmpty() {
      return this.users.length === 0
    },
  },
  methods: {
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
    getCrossingNumber(crossingId) {
      return getCrossingNumber(crossingId)
    },
    formatDate(date) {
      try {
        return format(new Date(date), "d MMM yyyy, H'h'mm", { locale: fr })
      } catch (error) {
        return '(Non renseignée)'
      }
    },
  },
}
</script>

<template>
  <div :class="$style.container">
    <b-table
      :data="isEmpty ? [] : users"
      :loading="isLoading"
      striped
      hoverable
      mobile-cards
      :class="$style.table"
      detail-key="id"
      default-sort-direction="DESC"
      default-sort="id"
      detailed
      show-detail-icon
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

      <template
        slot="detail"
        slot-scope="props"
        field="deaths"
        mobile-cards
        sort-icon="arrow-up"
      >
        <div v-if="props.row.deaths.length !== 0">
          <div v-for="death of props.row.deaths" :key="death.id">
            <h1 :class="$style.deathDetailTitle"
              >{{
                death.isSimulation
                  ? 'Mort simulée'
                  : `Traversée ${getCrossingNumber(death.crossingId)},
                    DCD-${death.idc.toString().padStart(2, '0')}`
              }}
            </h1>
            <div
              v-if="
                death.isSimulation &&
                  death.deathForm &&
                  death.deathForm.crossingDate
              "
              >Date de traversée (indication)
              {{
                death.deathForm && death.deathForm.crossingDate
                  ? formatDate(death.deathForm.crossingDate)
                  : '(Non renseignée)'
              }}</div
            >
            <div v-if="death.deathForm && death.deathForm.dreamDetails"
              >Rêve
              {{
                death.deathForm && death.deathForm.dreamDetails
                  ? death.deathForm.dreamDetails
                  : '(Non renseigné)'
              }}</div
            >
            <b-button
              :class="$style.displayFormButton"
              rounded
              type="is-info"
              @click="selectedDeath = death"
              >Voir forumulaire</b-button
            >
          </div>
        </div>
        <div v-else>
          <h1 :class="$style.deathDetailTitle">
            N'a pas rempli de formulaire
          </h1>
        </div>
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

    <b-modal :active="!!selectedDeath" @close="selectedDeath = null">
      <FormDisplay v-if="!!selectedDeath" :death="selectedDeath" />
    </b-modal>
  </div>
</template>

<style lang="scss" module>
@import '@design';

.table {
  .row {
    cursor: pointer;
  }
}
.deathDetailTitle {
  @extend %typography-medium;
}

.displayFormButton {
  margin: 0.5rem 0;
}
</style>
