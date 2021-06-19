<script>
import { mapState } from 'vuex'
import FormDisplay from '@components/form-display.vue'

export default {
  components: { FormDisplay },
  props: {
    noOp: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      searchField: '',
    }
  },
  computed: {
    ...mapState({
      fetchingDeathSimulations: (state) =>
        state.deaths.fetchingDeathSimulations,
      deathSimulationList: (state) => state.deaths.deathSimulationList,
    }),
    displayedDeaths(state) {
      const onlyWidthDeathForm = state.deathSimulationList
        ? state.deathSimulationList.filter((d) => d.deathForm)
        : []

      const onlyInSeath = state.searchField
        ? onlyWidthDeathForm.filter((d) =>
            d.user.email.includes(state.searchField)
          )
        : onlyWidthDeathForm

      return onlyInSeath
    },
  },
  mounted() {
    this.$store.dispatch('deaths/fetchDeathSimulations')
  },
}
</script>

<template>
  <div :class="$style.container">
    <div :class="$style.search">
      <b-input
        v-model="searchField"
        size="is-large"
        placeholder="Chercher email"
      />
    </div>
    <b-table
      :data="displayedDeaths"
      detail-key="id"
      default-sort-direction="DESC"
      default-sort="id"
      :class="$style.deathTable"
      detailed
      show-detail-icon
    >
      <template slot-scope="props">
        <b-table-column field="idc" label="N° DCD" sortable numeric centered>
          <b-tag type="is-dark">SIMULATION</b-tag>
        </b-table-column>
        <b-table-column field="user.email" label="Email" sortable>
          <span>
            {{ props.row.user.email }}
          </span>
        </b-table-column>
        <b-table-column v-if="!noOp" field="deathForm" label="FIRM">
          <span>
            <b-button
              v-if="props.row.deathForm && !noOp"
              type="is-link"
              size="is-small"
              @click="$emit('choose', props.row.user)"
              >Utiliser</b-button
            >
          </span>
        </b-table-column>
      </template>
      <template
        slot="detail"
        slot-scope="props"
        mobile-cards
        sort-icon="arrow-up"
      >
        <FormDisplay :death="props.row" />
      </template>
    </b-table>
  </div>
</template>

<style lang="scss" module>
@import '@design';
.container {
  .search {
    padding: 0.5rem;
  }
}
</style>
