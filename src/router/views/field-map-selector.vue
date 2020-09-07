<script>
import Layout from '@layouts/local.vue'
import ColumnSelector from '@components/column-selector.vue'
import { mapState, mapGetters } from 'vuex'

import helloAsso from './field-map-selector-debug.js'

export default {
  components: { Layout, ColumnSelector },
  data() {
    return {
      apiFields: Object.keys(this.$store.state.passengerParser.fieldMap),
    }
  },
  page: {
    title: 'Field Map Selector',
    meta: [{ name: 'description', content: 'The Field Map Selector page.' }],
  },
  computed: {
    ...mapState({
      fieldMap: (state) => state.passengerParser.fieldMap,
      fields: (state) => state.passengerParser.fields,
      parsedData: (state) => state.passengerParser.parsedData,
      emptyFields: (state) => state.passengerParser.emptyFields,
    }),
    ...mapGetters({
      fieldMapComplete: 'passengerParser/fieldMapComplete',
    }),
  },
  beforeCreate() {
    this.$store.dispatch('passengerParser/parseCSV', helloAsso)
  },
  methods: {
    setFieldMapEntry(apiEntry, originalEntry) {
      if (this.fieldMap[apiEntry] === originalEntry) {
        return this.unsetFieldMapEntry(apiEntry)
      }
      this.$store.dispatch('passengerParser/setFieldMapEntry', {
        apiEntry,
        originalEntry,
      })
    },
    unsetFieldMapEntry(apiEntry) {
      this.$store.dispatch('passengerParser/unsetFieldMapEntry', {
        apiEntry,
      })
    },
  },
}
</script>

<template>
  <Layout>
    <div :class="$style.container">
      <div :class="$style.mainTitle">
        <BaseTitle>Avant de continuer</BaseTitle>
      </div>

      <div :class="$style.field">
        <div :class="$style.description">
          <h3 :class="$style.descriptionInstruction">
            Pour aider le serveur à s'y retrouver, selectionnez la colonne
            contenant les
            <span :class="$style.apiColumnDesc">emails des acheteurs</span> :
          </h3>
          <p :class="$style.nottabene">
            Si une seule colonne contient des emails, selectionnez celle-ci.
          </p>
        </div>

        <ColumnSelector
          :column-names="fields.filter((field) => !emptyFields.includes(field))"
          :selected-column="fieldMap['bookerEmail']"
          :data="parsedData"
          @select="(selected) => setFieldMapEntry('bookerEmail', selected)"
          @unselect="() => unsetFieldMapEntry('bookerEmail')"
        />
      </div>

      <Transition appear>
        <div v-if="fieldMapComplete" :class="$style.buttonContainer">
          <b-button type="is-success" size="is-medium">
            Tout envoyer →
          </b-button>
        </div>
      </Transition>
    </div>
  </Layout>
</template>

<style lang="scss" module>
@import '@design';
.mainTitle {
  max-width: $size-content-width-max;
  margin: auto;
  p {
    padding: 0 1rem;
    margin-top: 1rem;
  }
}

.buttonContainer {
  max-width: $size-content-width-max;
  padding: 1rem;
  margin: auto;
  text-align: center;
}

.field {
  max-width: 100%;
  margin: 0 auto 2rem;
  .descriptionInstruction {
    margin-bottom: 0.5rem;
  }
  .apiColumnDesc {
    border-bottom: 1px solid black;
  }
  .description {
    max-width: $size-content-width-max;
    padding: 1rem;
    margin: 0 auto;
  }
}
.nottabene {
  font-size: 0.9em;
}
</style>
