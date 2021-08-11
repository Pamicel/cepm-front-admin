<script>
import Layout from '@layouts/local.vue'
import CrossingsTable from '@components/crossings-table.vue'
import CrossingCreationForm from '@components/crossing-creation-form.vue'
import CollapseForm from '@components/collapse-form.vue'
import { mapState } from 'vuex'

export default {
  page: {
    title: 'Traversées',
    meta: [{ name: 'description', content: 'Toutes les traversées.' }],
  },
  components: { Layout, CrossingsTable, CrossingCreationForm, CollapseForm },
  data() {
    return {
      formOpen: false,
    }
  },
  computed: {
    ...mapState({
      crossingList: (state) => state.crossings.crossingList,
      fetchingCrossings: (state) => state.crossings.fetchingCrossings,
      creatingCrossing: (state) => state.crossings.creatingCrossing,
    }),
  },
  mounted() {
    this.$store.dispatch('crossings/fetchCrossings')
  },
  methods: {
    async createCrossing(crossing) {
      const newCrossing = await this.$store.dispatch(
        'crossings/createCrossing',
        crossing
      )
      if (newCrossing) {
        await this.$store.dispatch('crossings/fetchCrossings')
      }
    },
    toggleForm() {
      this.formOpen = !this.formOpen
    },
    selectCrossing(crossingId) {
      this.$emit('crossings/selectCrossing', crossingId)
      this.$router.push({
        name: 'crossing-details',
        params: { id: crossingId },
      })
    },
  },
}
</script>

<template>
  <Layout>
    <div :class="$style.container">
      <h1 :class="$style.title">
        Traversées
      </h1>

      <CollapseForm :form-open.sync="formOpen" title="+ Créer une traversée">
        <CrossingCreationForm @send="createCrossing" @cancel="toggleForm" />
      </CollapseForm>

      <CrossingsTable
        :class="$style.crossingsTable"
        :performances="crossingList"
        :is-loading="fetchingCrossings || creatingCrossing"
        @select="selectCrossing"
      />
    </div>
  </Layout>
</template>

<style lang="scss" module>
@import '@design';

.container {
  @extend %narrow-content;

  padding: $size-grid-padding;
  padding-top: 0;

  .title {
    margin-bottom: 1rem;
  }
}
</style>
