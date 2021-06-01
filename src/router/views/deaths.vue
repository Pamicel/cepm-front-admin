<script>
import Layout from '@layouts/local.vue'
import CrossingInfos from '@components/crossing-infos.vue'
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
  },
  data() {
    return {
      formOpen: false,
      isCreateFormOpen: false,
      isDeathUploadOpen: false,
    }
  },
  computed: {
    ...mapState({
      fetchingDeaths: (state) => state.deaths.fetchingDeaths,
      creatingDeath: (state) => state.deaths.creatingDeath,
      fetchingCrossing: (state) => state.crossings.fetchingSingleCrossing,
      crossing: (state) => state.crossings.selectedCrossing,
      deathList: (state) => state.deaths.deathList,
      fetchingIdcWords: (state) => state.deaths.fetchingIdcWords,
      idcWords: (state) => state.deaths.idcWords,
    }),
  },
  async mounted() {
    const crossingId = this.$route.params.id

    if (!this.crossing || this.crossing.id !== crossingId) {
      const crossing = await this.$store.dispatch(
        'crossings/fetchSingleCrossing',
        crossingId
      )
      if (crossing === null) {
        return this.$router.replace({ name: 'crossings' })
      }
    }
    this.$store.dispatch('deaths/fetchDeaths', {
      crossingId,
    })
    this.$store.dispatch('deaths/fetchIdcWords')
  },
  methods: {
    async createNewDeath() {
      await this.$store.dispatch('deaths/createDeath', {
        crossingId: this.crossing.id,
      })
    },
  },
}
</script>

<template>
  <Layout>
    <div :class="$style.container">
      <CrossingInfos
        v-if="!fetchingCrossing && crossing"
        :crossing="crossing"
      />
      <BaseIcon v-else :class="$style.loadingIcon" name="fan" spin />
      <br />
      <b-button icon-right="plus" type="is-dark" rounded @click="createNewDeath"
        >Ajouter une mort</b-button
      >
      <br />
      <br />
      <b-table
        :data="deathList"
        detail-key="id"
        default-sort-direction="DESC"
        default-sort="idc"
      >
        <template slot-scope="props">
          <b-table-column field="idc" label="N° DCD" sortable numeric centered>
            <b-tag type="is-dark"
              >DCD-{{ props.row.idc.toString().padStart(2, '0') }}</b-tag
            >
          </b-table-column>
          <b-table-column field="deathForm" label="FIRM">
            <span>
              <span v-if="!props.row.deathForm" class="tag is-small is-danger"
                >Pas de FIRM</span
              >
              <span
                v-else-if="props.row.deathForm && props.row.deathForm.filled"
                class="tag is-small is-success"
                >FIRM complet</span
              >
              <span v-else class="tag is-small is-info">Firm associé</span>
            </span>
          </b-table-column>
          <b-table-column label="Mot de passage">
            <b-tag>{{
              fetchingIdcWords ? '...' : idcWords[props.row.idc - 1]
            }}</b-tag>
          </b-table-column>
        </template>
      </b-table>
    </div>
  </Layout>
</template>

<style lang="scss" module>
@import '@design';

.container {
  @extend %narrow-content;
  .title {
    margin: 0 auto 2rem;
    text-align: center;
  }
  .upload {
    text-align: center;
    .uploadButton {
      @include embossed_paper_shadow(2);
      @extend %typography-xlarge;

      width: 5rem;
      height: 5rem;
      margin: 1rem auto;
      cursor: pointer;
      background: transparent;
      border: 0;
      border-radius: 50rem;
      &:focus {
        @include embossed_paper_shadow(1);
      }
    }
  }
  .uploadModal {
    position: relative;
    box-sizing: border-box;
    width: 50rem;
    max-width: 90%;
    height: 100%;
    margin: auto;
    overflow: auto;
    background: $color-body-bg;
    border-radius: 8px;
  }
}
</style>
