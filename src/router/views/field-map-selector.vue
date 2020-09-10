<script>
import Layout from '@layouts/local.vue'
import ColumnSelector from '@components/column-selector.vue'
import { mapState, mapGetters } from 'vuex'

export default {
  components: { Layout, ColumnSelector },
  data() {
    return {
      file: null,
      fileError: null,
      apiFields: Object.keys(this.$store.state.bookingsParser.fieldMap),
    }
  },
  page: {
    title: 'Field Map Selector',
    meta: [{ name: 'description', content: 'The Field Map Selector page.' }],
  },
  computed: {
    ...mapState({
      fieldMap: (state) => state.bookingsParser.fieldMap,
      fields: (state) => state.bookingsParser.fields,
      parsedData: (state) => state.bookingsParser.parsedData,
      emptyFields: (state) => state.bookingsParser.emptyFields,
    }),
    ...mapGetters({
      fieldMapComplete: 'bookingsParser/fieldMapComplete',
    }),
  },
  beforeCreate() {
    if (this.parsedData.length === 0) {
      this.$router.replace('')
    }
  },
  methods: {
    async readNewFile(file) {
      this.fileError = false
      try {
        await this.$store.dispatch('bookingsParser/parseCSV', file)
      } catch (error) {
        console.error(error)
        this.fileError = true
      }
    },
    setFieldMapEntry(apiEntry, originalEntry) {
      if (this.fieldMap[apiEntry] === originalEntry) {
        return this.unsetFieldMapEntry(apiEntry)
      }
      this.$store.dispatch('bookingsParser/setFieldMapEntry', {
        apiEntry,
        originalEntry,
      })
    },
    unsetFieldMapEntry(apiEntry) {
      this.$store.dispatch('bookingsParser/unsetFieldMapEntry', {
        apiEntry,
      })
    },
  },
}
</script>

<template>
  <Layout>
    <div :class="$style.container">
      <div>
        <div :class="$style.mainTitle">
          <BaseTitle>Nouvelles réservations</BaseTitle>
        </div>
        <div :class="$style.description">
          <h3 :class="$style.descriptionInstruction">
            Uploadez
            <span :class="$style.apiColumnDesc"
              >le fichier .csv contenant les réservations</span
            >
            :
          </h3>
        </div>
        <div :class="$style.upload">
          <b-upload
            v-model="file"
            drag-drop
            :type="fileError ? 'is-danger' : file ? 'is-success' : ''"
            accept=".csv"
            class="file-label"
            @input="readNewFile"
          >
            <section class="section">
              <div class="content has-text-centered">
                <p>
                  <b-icon :icon="file ? 'check' : 'upload'" size="is-large" />
                </p>
                <p>{{ file ? file.name : 'Cliquez ou glissez un fichier' }}</p>
              </div>
            </section>
          </b-upload>
        </div>
      </div>
      <Transition name="fade">
        <div
          v-if="file && !fileError && parsedData && parsedData.length > 0"
          :class="$style.afterUpload"
        >
          <div>
            <div :class="$style.description">
              <h3 :class="$style.descriptionInstruction">
                Avant de continuer, pour aider le serveur à s'y retrouver,
                selectionnez la colonne contenant les
                <span :class="$style.apiColumnDesc">emails des acheteurs</span>
                :
              </h3>
              <p :class="$style.nottabene">
                Faites très attention, il y a parfois plusieurs colonnes
                d'email, veillez à sélectionner la bonne colonne.
              </p>
            </div>

            <ColumnSelector
              :column-names="
                fields.filter((field) => !emptyFields.includes(field))
              "
              :selected-column="fieldMap['bookerEmail']"
              :data="parsedData"
              @select="(selected) => setFieldMapEntry('bookerEmail', selected)"
              @unselect="() => unsetFieldMapEntry('bookerEmail')"
            />
          </div>

          <Transition name="fade">
            <div v-if="fieldMapComplete" :class="$style.buttonContainer">
              <b-button
                size="is-medium"
                @click="() => unsetFieldMapEntry('bookerEmail')"
              >
                Changer
              </b-button>

              <div :class="$style.conclusion">
                <div :class="$style.description">
                  <h3 :class="$style.descriptionInstruction">
                    Merci, toutes les données peuvent maintenant être envoyées
                    au serveur
                  </h3>
                </div>
              </div>
              <b-button type="is-success" size="is-medium">
                Envoyer →
              </b-button>
            </div>
          </Transition>
        </div>
      </Transition>
    </div>
  </Layout>
</template>

<style lang="scss" module>
@import '@design';

.upload {
  text-align: center;
}

.mainTitle {
  max-width: $size-content-width-max;
  margin: auto;
  p {
    padding: 0 1rem;
    margin-top: 1rem;
  }
}

.conclusion {
  margin-top: 1rem;
}

.buttonContainer {
  max-width: $size-content-width-max;
  padding: 1rem;
  margin: auto;
  text-align: center;
}

// .field {
//   max-width: 100%;
//   margin: 0 auto 2rem;
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
// }
.nottabene {
  font-size: 0.9em;
}
</style>
