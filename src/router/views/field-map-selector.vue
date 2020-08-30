<script>
import Layout from '@layouts/local.vue'
import ColumnSelector from '@components/column-selector.vue'
import { mapState } from 'vuex'

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
        <BaseTitle
          >Avant de continuer, selectionnez les colonnes qui nous
          intéressent</BaseTitle
        >
        <p>Il suffit de cliquer sur la colonne</p>
      </div>

      <div :class="$style.field">
        <div :class="$style.description">
          <h3 :class="$style.descriptionInstruction">
            Selectionnez la colonne contenant les
            <br />
            <span :class="$style.apiColumnDesc"
              >identifiants uniques de réservation</span
            >
            :
          </h3>
          <p :class="$style.nottabene">
            Code unique de chaque réservation, généralement "Numéro de
            réservation"
          </p>
        </div>

        <ColumnSelector
          :column-names="fields.filter((field) => !emptyFields.includes(field))"
          :selected-column="fieldMap['bookingIdentifier']"
          :data="parsedData"
          @select="
            (selected) => setFieldMapEntry('bookingIdentifier', selected)
          "
          @unselect="() => unsetFieldMapEntry('bookingIdentifier')"
        />
      </div>

      <div :class="$style.field">
        <div :class="$style.description">
          <h3 :class="$style.descriptionInstruction">
            Selectionnez la colonne contenant les
            <br />
            <span :class="$style.apiColumnDesc">emails des acheteurs</span> :
          </h3>
          <p :class="$style.nottabene">
            Si une seule colonne contient des emails, selectionnez celle-ci
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

      <div :class="$style.field">
        <div :class="$style.description">
          <h3 :class="$style.descriptionInstruction">
            Selectionnez la colonne contenant les
            <br />
            <span :class="$style.apiColumnDesc">types de réservation</span>
            :
          </h3>
          <p :class="$style.nottabene">
            Exple: "Plein tarif" "Invité" "Tarif Réduit"
          </p>
        </div>

        <ColumnSelector
          :column-names="fields.filter((field) => !emptyFields.includes(field))"
          :selected-column="fieldMap['bookingType']"
          :data="parsedData"
          @select="(selected) => setFieldMapEntry('bookingType', selected)"
          @unselect="() => unsetFieldMapEntry('bookingType')"
        />
      </div>

      <div :class="$style.field">
        <div :class="$style.description">
          <h3 :class="$style.descriptionInstruction">
            Selectionnez la colonne contenant les
            <br />
            <span :class="$style.apiColumnDesc">prénoms des acheteurs</span>
            :
          </h3>
          <p :class="$style.nottabene">
            (Facultatif) Attention le passager et l'acheteur peuvent être deux
            personnes différentes, assurez-vous qu'il s'agit bien de l'acheteur
          </p>
        </div>

        <ColumnSelector
          :column-names="fields.filter((field) => !emptyFields.includes(field))"
          :selected-column="fieldMap['bookerFirstName']"
          :data="parsedData"
          @select="(selected) => setFieldMapEntry('bookerFirstName', selected)"
          @unselect="() => unsetFieldMapEntry('bookerFirstName')"
        />
      </div>

      <div :class="$style.field">
        <div :class="$style.description">
          <h3 :class="$style.descriptionInstruction">
            Selectionnez la colonne contenant les
            <br />
            <span :class="$style.apiColumnDesc"
              >noms de famille des acheteurs</span
            >
            :
          </h3>
          <p :class="$style.nottabene">
            (Facultatif) Attention le passager et l'acheteur peuvent être deux
            personnes différentes, assurez-vous qu'il s'agit bien de l'acheteur
          </p>
        </div>

        <ColumnSelector
          :column-names="fields.filter((field) => !emptyFields.includes(field))"
          :selected-column="fieldMap['bookerLastName']"
          :data="parsedData"
          @select="(selected) => setFieldMapEntry('bookerLastName', selected)"
          @unselect="() => unsetFieldMapEntry('bookerLastName')"
        />
      </div>

      <div :class="$style.field">
        <div :class="$style.description">
          <h3 :class="$style.descriptionInstruction">
            Selectionnez la colonne contenant les
            <br />
            <span :class="$style.apiColumnDesc">prénoms des passagers</span>
            :
          </h3>
          <p :class="$style.nottabene">
            (Facultatif) Attention le passager et l'acheteur peuvent être deux
            personnes différentes, assurez-vous qu'il s'agit bien du passager
          </p>
        </div>

        <ColumnSelector
          :column-names="fields.filter((field) => !emptyFields.includes(field))"
          :selected-column="fieldMap['firstName']"
          :data="parsedData"
          @select="(selected) => setFieldMapEntry('firstName', selected)"
          @unselect="() => unsetFieldMapEntry('firstName')"
        />
      </div>

      <div :class="$style.field">
        <div :class="$style.description">
          <h3 :class="$style.descriptionInstruction">
            Selectionnez la colonne contenant les
            <br />
            <span :class="$style.apiColumnDesc"
              >noms de famille des passagers</span
            >
            :
          </h3>
          <p :class="$style.nottabene">
            (Facultatif) Attention le passager et l'acheteur peuvent être deux
            personnes différentes, assurez-vous qu'il s'agit bien du passager
          </p>
        </div>

        <ColumnSelector
          :column-names="fields.filter((field) => !emptyFields.includes(field))"
          :selected-column="fieldMap['lastName']"
          :data="parsedData"
          @select="(selected) => setFieldMapEntry('lastName', selected)"
          @unselect="() => unsetFieldMapEntry('lastName')"
        />
      </div>

      <BaseButton>
        Étape suivante
      </BaseButton>
    </div>
  </Layout>
</template>

<style lang="scss" module>
@import '@design';
.mainTitle {
  max-width: $size-content-width-max;
  margin: auto;
  margin-bottom: 2rem;
  p {
    padding: 0 1rem;
    margin-top: 1rem;
  }
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
