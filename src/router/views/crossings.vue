<script>
import Layout from '@layouts/local.vue'
import CrossingsTable from '@components/crossings-table.vue'
import CrossingCreationForm from '@components/crossing-creation-form.vue'
import { mapState } from 'vuex'

export default {
  page: {
    title: 'Traversées',
    meta: [{ name: 'description', content: 'Toutes les traversées.' }],
  },
  components: { Layout, CrossingsTable, CrossingCreationForm },
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
    toggleModal() {
      this.formOpen = !this.formOpen
    },
    selectCrossing(crossingId) {
      this.$emit('crossings/selectCrossing', crossingId)
      this.$router.push({ name: 'traversee', params: { id: crossingId } })
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

      <div :class="[$style.creation, formOpen ? $style.creationOpen : '']">
        <b-collapse :open.sync="formOpen">
          <BaseButton
            slot="trigger"
            :class="[
              $style.createButton,
              formOpen ? $style.createButtonOpen : '',
            ]"
          >
            + Créer une traversée
          </BaseButton>
          <div :class="$style.creationFormContainer">
            <CrossingCreationForm
              @send="createCrossing"
              @cancel="toggleModal"
            />
          </div>
        </b-collapse>
      </div>
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

  .creation {
    // width: fit-content;
    width: 100%;
    transition: all 200ms;
    .creationForm {
      width: fit-content;
    }
    &.creationOpen {
      @include box_shadow(1);

      padding: 1rem;
      margin: 0 0 1rem 0;
      background-color: #fff;
      border: 1px solid lightgrey;
      border-radius: 4px;
    }

    .createButton {
      @extend %typography-medium;

      padding: 0;
      margin: 0 0 1rem;
      background-color: transparent;
      border-bottom: 0.1em solid transparent;
      transition: all 100ms;
      &:hover {
        border-color: black;
      }
      &.createButtonOpen {
        @extend %typography-large;
      }
    }
  }

  .title {
    margin-bottom: 1rem;
  }

  .crossingsTable {
    border-right: 5px solid black;
    border-left: 5px solid black;
    border-radius: 4px;
  }
}
</style>
