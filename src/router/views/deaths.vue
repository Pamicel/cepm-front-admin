<script>
import Layout from '@layouts/local.vue'
import CrossingInfos from '@components/crossing-infos.vue'
import FormDisplay from '@components/form-display.vue'
import DeathSimulationTable from '@components/death-simulation-table.vue'
import { mapState } from 'vuex'

export default {
  page: {
    title: 'Panneau de traversée',
    meta: [
      { name: 'description', content: 'Liste des morts de la traversée.' },
    ],
  },
  components: {
    Layout,
    CrossingInfos,
    FormDisplay,
    DeathSimulationTable,
  },
  data() {
    return {
      formOpen: false,
      isCreateFormOpen: false,
      isDeathUploadOpen: false,
      crossingId: +this.$route.params.id,
      selectedDeathId: null,
      firmPanelDeath: null,
    }
  },
  computed: {
    ...mapState({
      fetchingDeaths: (state) => state.deaths.fetchingDeaths,
      creatingDeath: (state) => state.deaths.creatingDeath,
      crossingList: (state) => state.crossings.crossingList,
      fetchingCrossings: (state) => state.crossings.fetchingCrossings,
      modifyingCrossing: (state) => state.crossings.modifyingCrossing,
      deathList: (state) => state.deaths.deathList,
      changingDeathOwner: (state) => state.deaths.changingDeathOwner,
    }),
    crossing(state) {
      return (
        state.crossingList &&
        state.crossingList.find((c) => c.id === state.crossingId)
      )
    },
    selectedDeath(state) {
      return state.deathList.find((d) => d.id === state.selectedDeathId)
    },
  },
  async mounted() {
    const crossingId = this.$route.params.id

    this.$store.dispatch('deaths/fetchDeathSimulations')
    if (!this.crossing || this.crossing.id !== crossingId) {
      await this.$store.dispatch('crossings/fetchCrossings')
    }
    this.$store.dispatch('deaths/fetchDeaths', {
      crossingId,
    })
  },
  methods: {
    async createNewDeath() {
      await this.$store.dispatch('deaths/createDeath', {
        crossingId: this.crossing.id,
      })
    },
    archive() {
      this.$store.dispatch('crossings/modifyCrossing', {
        id: this.crossing.id,
        changes: {
          archived: !this.crossing.archived,
        },
      })
    },
    openUserPanel(death) {
      this.firmPanelDeath = death
    },
    closeUserPanel() {
      this.firmPanelDeath = null
    },
    async linkFirm(user, death) {
      const userId = user.id
      const deathId = death.id
      const deathIdc = death.idc
      const userEmail = user.email

      this.firmPanelDeath = null
      const success = await this.$store.dispatch('deaths/changeDeathOwner', {
        deathId,
        userId,
      })
      if (!success) {
        this.$buefy.dialog.alert({
          title: 'Error',
          message: `Impossible d'associer le firm de ${userEmail} à DCD-${deathIdc}. Vérifiez que l'email ${userEmail} n'est pas déjà utilisé sur cette traversée.`,
          type: 'is-danger',
          ariaRole: 'alertdialog',
          ariaModal: true,
        })
      }
    },
    linkFirmPrompt(user) {
      this.$buefy.dialog.confirm({
        message: `Êtes-vous sûr·e de vouloir associer le firm de ${user.email} à DCD-${this.firmPanelDeath.idc}.`,
        title: 'Associer un FIRM',
        confirmText: 'Oui',
        onConfirm: () => this.linkFirm(user, this.firmPanelDeath),
        cancelText: 'Annuler',
        type: 'is-danger',
      })
    },
  },
}
</script>

<template>
  <Layout>
    <div :class="$style.container">
      <CrossingInfos
        v-if="crossing"
        :crossing="crossing"
        :loading="fetchingCrossings || modifyingCrossing"
        @archive="archive"
      />
      <BaseIcon v-else :class="$style.loadingIcon" name="fan" spin />
      <h2 :class="$style.subtitle">Liste des morts</h2>
      <div :class="$style.deathButtonContainer">
        <b-button
          icon-right="plus"
          type="is-dark"
          :disabled="
            creatingDeath || fetchingDeaths || (crossing && crossing.archived)
          "
          rounded
          @click="createNewDeath"
          >Ajouter une mort</b-button
        >
      </div>
      <b-table
        :data="deathList"
        detail-key="id"
        default-sort-direction="DESC"
        default-sort="idc"
        :class="$style.deathTable"
      >
        <template slot-scope="props">
          <b-table-column field="idc" label="N° DCD" sortable numeric centered>
            <b-tag type="is-dark"
              >DCD-{{ props.row.idc.toString().padStart(2, '0') }}</b-tag
            >
          </b-table-column>
          <b-table-column field="deathForm" label="FIRM">
            <span>
              <b-button
                v-if="!props.row.deathForm"
                type="is-link"
                size="is-small"
                icon-right="plus"
                :loading="changingDeathOwner.includes(props.row.id)"
                :disabled="changingDeathOwner.includes(props.row.id)"
                @click="() => openUserPanel(props.row)"
                >Associer un FIRM</b-button
              >
              <span
                v-else-if="props.row.deathForm && props.row.deathForm.filled"
                class="tag is-small is-success"
                >FIRM complet</span
              >
              <span v-else class="tag is-small is-info">Firm associé</span>
              <span
                v-if="props.row.deathForm"
                class="tag is-small is-info is-rounded"
                :class="$style.openFirmDisplayButton"
                role="button"
                @click="selectedDeathId = props.row.id"
                >voir</span
              >
            </span>
          </b-table-column>
          <b-table-column label="Mot de passage">
            <b-tag>{{ props.row.idcWord }}</b-tag>
          </b-table-column>
        </template>
      </b-table>
      <b-modal
        :active="!!selectedDeathId && !!selectedDeath"
        @close="selectedDeathId = null"
      >
        <FormDisplay v-if="!!selectedDeath" :death="selectedDeath" />
      </b-modal>
      <b-modal :active="!!firmPanelDeath" @close="closeUserPanel">
        <DeathSimulationTable
          v-if="!!firmPanelDeath"
          @choose="linkFirmPrompt"
        />
      </b-modal>
    </div>
  </Layout>
</template>

<style lang="scss" module>
@import '@design';

.container {
  @extend %narrow-content;
  .subtitle {
    @extend %typography-large;

    margin-top: $size-grid-padding;
    font-weight: bold;
    text-align: center;
  }
  .deathTable {
    margin-bottom: $size-grid-padding;
  }

  .openFirmDisplayButton {
    margin-left: 0.5em;
    cursor: pointer;
  }

  // .formDisplay {
  //   .firmDisplayHeader {
  //     margin-bottom: 2rem;
  //     text-align: center;
  //   }
  //   .firmDisplayTitle {
  //     color: white;
  //     @extend %typography-large;
  //   }
  //   .firmDisplaySubtitle {
  //     color: white;
  //     @extend %typography-medium;
  //   }

  //   padding: $size-grid-padding;
  //   background-color: grey;
  // }
  .deathButtonContainer {
    padding: $size-grid-padding;
    margin-bottom: $size-grid-padding;
    text-align: center;
  }
}
</style>
