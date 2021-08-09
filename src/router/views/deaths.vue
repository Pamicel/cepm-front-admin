<script>
import Layout from '@layouts/local.vue'
import CrossingInfos from '@components/crossing-infos.vue'
import FormDisplay from '@components/form-display.vue'
import DeathSimulationTable from '@components/death-simulation-table.vue'
import { mapState } from 'vuex'
import CrossingStatistics from '@/src/components/crossing-statistics.vue'
import MicroFirm from '@/src/components/micro-firm.vue'
import DeathSummary from '@/src/components/death-summary.vue'

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
    CrossingStatistics,
    MicroFirm,
    DeathSummary,
  },
  data() {
    return {
      formOpen: false,
      isCreateFormOpen: false,
      isDeathUploadOpen: false,
      crossingId: +this.$route.params.id,
      selectedDeathId: null,
      firmPanelDeath: null,
      statisticsOpen: false,
      firmListOpen: false,
      microFirmPanelOpen: null,
      deathAscIdc: true,
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
    deathSimTableOpen(state) {
      return !!state.firmPanelDeath || state.firmListOpen
    },
  },
  async mounted() {
    const crossingId = this.$route.params.id

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
    closeDeathSimTable() {
      if (this.firmPanelDeath !== null) {
        this.firmPanelDeath = null
      }
      if (this.firmListOpen) {
        this.firmListOpen = false
      }
    },
    openUserPanel(death) {
      this.firmPanelDeath = death
    },
    closeUserPanel() {
      this.firmPanelDeath = null
    },
    openMicroFirm(deathId) {
      this.microFirmPanelOpen = deathId
    },
    refreshAndCloseMicroFirm() {
      this.$store.dispatch('deaths/fetchDeaths', {
        crossingId: this.crossing.id,
      })
      this.closeMicroFirm()
    },
    closeMicroFirm() {
      this.microFirmPanelOpen = null
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
          message: `Impossible d'associer le firm de ${userEmail} à DCD-${deathIdc}. Vérifiez que vous êtes bien connecté·e à internet et que l'email ${userEmail} n'est pas déjà utilisé sur cette traversée.`,
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
    openFirmList() {
      this.firmListOpen = true
    },
    closeFirmList() {
      this.firmListOpen = false
    },
    changeDeathOrder() {
      this.deathAscIdc = !this.deathAscIdc
    },
  },
}
</script>

<template>
  <Layout>
    <div :class="$style.container">
      <b-button
        type="is-link"
        rounded
        size="is-small"
        icon-left="arrow-left"
        @click="$router.push({ name: 'crossings' })"
        >Traversées</b-button
      >
      <br />
      <br />
      <CrossingInfos
        v-if="crossing"
        :crossing="crossing"
        :loading="fetchingCrossings || modifyingCrossing"
        @archive="archive"
      />
      <BaseIcon v-else :class="$style.loadingIcon" name="fan" spin />
      <h2 :class="$style.subtitle">Liste des morts :</h2>
      <!-- <div :class="$style.firmListButtonContainer">
        <b-button
          type="is-link"
          :disabled="fetchingDeaths"
          :loading="fetchingDeaths"
          @click="firmListOpen = true"
          >Liste des FIRMs</b-button
        >
      </div> -->

      <div :class="$style.deathListContainer">
        <div :class="$style.actionButtons">
          <div :class="$style.idcOrderButton">
            <b-button type="is-dark" @click="changeDeathOrder">
              DCD
              <span
                :data-state="deathAscIdc ? 'ASC' : 'DESC'"
                :class="$style.idcOrderArrow"
                >↓</span
              >
            </b-button>
          </div>
          <div :class="$style.statisticsButton">
            <b-button
              icon-left="chart-bar"
              type="is-info"
              :disabled="fetchingDeaths"
              :loading="fetchingDeaths"
              @click="statisticsOpen = true"
              >Statistiques</b-button
            >
          </div>
          <div :class="$style.addDeathButton">
            <b-button
              icon-right="plus"
              type="is-warning"
              :disabled="
                creatingDeath ||
                  fetchingDeaths ||
                  (crossing && crossing.archived)
              "
              @click="createNewDeath"
              >Ajouter une mort</b-button
            >
          </div>
        </div>
        <DeathSummary
          v-for="death in [...deathList].sort((da, db) => {
            if (deathAscIdc) return da.idc > db.idc ? -1 : 1
            else return da.idc > db.idc ? 1 : -1
          })"
          :key="death.idc"
          :death="death"
          :loading="changingDeathOwner.includes(death.id)"
          @openUserPanel="() => openUserPanel(death)"
          @openMicroFirm="() => openMicroFirm(death.id)"
          @select="selectedDeathId = death.id"
        />
      </div>
      <b-modal
        :active="!!selectedDeathId && !!selectedDeath"
        @close="selectedDeathId = null"
      >
        <div :class="$style.formDisplayContainer">
          <div :class="$style.closeButton">
            <b-button
              type="is-danger"
              rounded
              icon-right="times"
              @click="selectedDeathId = null"
              >Fermer</b-button
            >
          </div>
          <FormDisplay v-if="!!selectedDeath" :death="selectedDeath" />
        </div>
      </b-modal>
      <b-modal :active="deathSimTableOpen" @close="closeDeathSimTable">
        <div :class="$style.deathSimTableContainer">
          <div :class="$style.closeButton">
            <b-button
              type="is-danger"
              rounded
              icon-right="times"
              @click="closeDeathSimTable"
              >Fermer</b-button
            >
          </div>
          <DeathSimulationTable
            v-if="deathSimTableOpen"
            :no-op="firmListOpen"
            @choose="linkFirmPrompt"
            @close="closeDeathSimTable"
          />
        </div>
      </b-modal>
      <!-- <b-modal :active="firmListOpen">
        <div :class="$style.closeButton">
          <b-button
            type="is-danger"
            rounded
            icon-right="times"
            @click="closeFirmList"
            >Fermer</b-button
          >
        </div>
        <DeathSimulationTable
          v-if="firmListOpen"
          no-op
          @close="closeFirmList"
        />
      </b-modal> -->
      <b-modal :active="statisticsOpen" @close="statisticsOpen = false">
        <CrossingStatistics v-if="statisticsOpen" :crossing-id="crossingId" />
      </b-modal>
      <b-modal :active="!!microFirmPanelOpen" @close="closeMicroFirm">
        <div :class="$style.microFirmContainer">
          <div :class="$style.closeButton">
            <b-button
              type="is-danger"
              rounded
              icon-right="times"
              @click="closeMicroFirm"
              >Fermer</b-button
            >
          </div>
          <MicroFirm
            v-if="microFirmPanelOpen"
            :death-id="microFirmPanelOpen"
            @done="refreshAndCloseMicroFirm"
          />
        </div>
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

    margin: (2 * $size-grid-padding) 0 $size-grid-padding;
    font-weight: bold;
  }
  .deathTable {
    margin-bottom: $size-grid-padding;
  }

  .openFirmDisplayButton {
    margin-left: 0.5em;
    cursor: pointer;
  }

  .firmExpressButton {
    margin-left: 0.5em;
  }

  .deathSimTableContainer,
  .microFirmContainer,
  .formDisplayContainer {
    position: relative;
    padding: 1rem;
    background-color: grey;
    .closeButton {
      position: fixed;
      top: $size-grid-padding;
      right: $size-grid-padding;
      z-index: $layer-tooltip-z-index;
    }
  }

  .actionButtons {
    display: flex;
    flex-direction: row;
    > * {
      margin-right: 0.5rem;
    }
    .idcOrderButton {
      margin-bottom: $size-grid-padding;
      .idcOrderArrow {
        display: inline-block;
        font-weight: bold;
        transition: all 200ms;
        &[data-state='ASC'] {
          transform: rotate(180deg);
        }
      }
    }
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
}
</style>
