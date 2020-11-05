<script>
import Layout from '@layouts/local.vue'
import ColumnSelector from '@components/column-selector.vue'
import { mapState, mapGetters } from 'vuex'

export default {
  components: { Layout, ColumnSelector },
  data() {
    return {
      BUTTON_STATES: {
        EMPTY: 'EMPTY',
        VALID_FILE: 'VALID_FILE',
        INVALID_FILE: 'INVALID_FILE',
      },
      file: null,
      fileError: null,
      isOpen: false,
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
      parsingErrors: (state) => state.bookingsParser.parsingErrors,
      emptyFields: (state) => state.bookingsParser.emptyFields,
      crossing: (state) => state.crossings.selectedCrossing,
      creatingBookings: (state) => state.bookings.creatingBookings,
      bookingCreationResponse: (state) =>
        state.bookings.bookingCreationResponse,
    }),
    ...mapGetters({
      fieldMapComplete: 'bookingsParser/fieldMapComplete',
      responseIsEmpty: 'bookings/bookingCreationResponseIsEmpty',
    }),
    pageDisabled() {
      return !this.crossing || this.creatingBookings
    },
    uploadInputState() {
      const hasError = this.fileError
      const hasFile = !!this.file
      if (hasError) {
        return this.BUTTON_STATES.INVALID_FILE
      } else if (hasFile) {
        return this.BUTTON_STATES.VALID_FILE
      }
      return this.BUTTON_STATES.EMPTY
    },
    uploadInputType() {
      switch (this.uploadInputState) {
        case this.BUTTON_STATES.INVALID_FILE:
          return 'is-danger'
        case this.BUTTON_STATES.VALID_FILE:
          return 'is-success'
        default:
          return ''
      }
    },
    uploadInputIcon() {
      if (this.uploadInputState === this.BUTTON_STATES.INVALID_FILE) {
        return 'frown'
      }
      return 'upload'
    },
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
    await this.$store.dispatch('bookings/fetchBookings', {
      crossingId,
    })
  },
  methods: {
    async promptRowsWithMissingRequiredField() {
      return new Promise((resolve, reject) => {
        const rows = this.$store.getters[
          'bookingsParser/rowsWithMissingRequiredFields'
        ]
        const procede = () => resolve(true)
        const abandon = () => resolve(false)

        if (rows.length > 0) {
          // If some rows have missing required values
          // give the options do continue or abandon
          return this.$buefy.dialog.confirm({
            title: '⚠️',
            message:
              "<b>Certaines lignes n'ont pas d'email</b> et seront donc ignorés",
            confirmText: 'Envoyer',
            cancelText: 'Annuler',
            type: 'is-black',
            onConfirm: procede,
            onCancel: abandon,
            ariaRole: 'alertdialog',
            ariaModal: true,
          })
        }

        // if all rows are complete, continue
        return procede
      })
    },
    async send() {
      // prompt the user about missing required values (if needed)
      const procede = await this.promptRowsWithMissingRequiredField()
      if (!procede) {
        return
      }

      const data = this.$store.getters['bookingsParser/dataDigest']
      const crossingId = this.crossing.id
      const fieldMap = this.fieldMap
      const created = await this.$store.dispatch('bookings/createBookings', {
        data,
        crossingId,
        fieldMap,
      })

      if (!created) {
        this.$buefy.toast.open({
          duration: 5000,
          message: `<b>Échec de l'envoi</b>: une erreur inconnue s'est produite.`,
          position: 'is-bottom',
          type: 'is-danger',
        })
      } else {
        this.showResponse()
      }
    },
    showResponse() {
      const { bookingCreationResponse } = this
      const {
        created,
        numberOfRowsRecieved,
        numberOfRowsSkipped,
        rowsSkipped,
      } = bookingCreationResponse

      const message = (
        numberOfRowsRecieved,
        numberOfRowsSkipped,
        rowsSkipped
      ) => {
        const recievedMessage = `<p><b>${numberOfRowsRecieved} ligne${
          numberOfRowsRecieved > 1 ? 's ont été traitées' : 'a été traitée'
        }</b></p>`
        const numCreated = created.length
        const createdMessage = () => {
          const pre = '<p><b>'
          const post = '</b></p>'
          if (numCreated === 0) {
            return `${pre}Aucune nouvelle réservation n'a été créée${post}`
          } else if (numCreated === 1) {
            return `${pre}1 nouvelle réservation a été créée${post}`
          }
          return `${pre}${numCreated} nouvelles réservations ont été créées${post}`
        }

        const initialAcc = {
          exist: 0,
          invalid: 0,
          incomplete: 0,
        }
        const { exist, invalid } = (rowsSkipped || []).reduce((acc, row) => {
          switch (row.reason) {
            case 'exists':
              acc.exist++
              break
            case 'invalid':
              acc.invalid++
              break
          }

          return acc
        }, initialAcc)

        const existMessage = `Réservations déjà existantes : ${exist}`
        const invalidMessage = `Réservations dont l'email n'est pas valide : ${invalid}`
        const ignored =
          numberOfRowsSkipped > 0
            ? `
                <br/>
                <p>
                  <b>Lignes ignorées</b> : <br/>
                  ${existMessage}<br/>
                  ${invalidMessage}
                </p>
              `
            : ''

        return `${recievedMessage}${createdMessage()}${ignored}`
      }

      const procede = () => {
        this.$router.push({
          name: 'bookings',
          params: { id: this.crossing.id },
        })
      }

      const allBad = numberOfRowsRecieved === numberOfRowsSkipped

      return this.$buefy.dialog.confirm({
        title: allBad ? '⚠ Importation terminée' : 'Importation terminée',
        message: message(
          numberOfRowsRecieved,
          numberOfRowsSkipped,
          rowsSkipped
        ),
        confirmText: 'Terminer',
        cancelText: 'Réessayer',
        type: 'is-black',
        onConfirm: procede,
        canCancel: false,
        ariaRole: 'alertdialog',
        ariaModal: true,
      })
    },
    async readNewFile(file) {
      this.fileError = false
      try {
        await this.$store.dispatch('bookingsParser/parseCSV', file)
        const hasMissingQuotesError = !!this.parsingErrors.find(
          (error) => error.type === 'Quotes'
        )
        this.fileError = hasMissingQuotesError
      } catch (error) {
        console.error(error)
        this.fileError = true
      }
    },
    resetFile() {
      this.$store.dispatch('bookingsParser/reset')
      this.file = null
      this.fileError = null
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
      <!-- Page title -->

      <div :class="$style.mainTitle">
        <BaseTitle>Nouvelles réservations</BaseTitle>
      </div>

      <!-- File upload section -->

      <Transition name="slide-fade" mode="out-in">
        <!-- If no file or corrupt file -->
        <div
          v-if="uploadInputState !== BUTTON_STATES.VALID_FILE"
          key="uploader"
        >
          <div :class="$style.description">
            <h3 :class="$style.descriptionInstruction">
              Uploadez
              <span :class="$style.importantText"
                >le fichier .csv contenant les réservations</span
              >
              :
            </h3>
          </div>
          <div :class="$style.upload">
            <b-upload
              v-model="file"
              expanded
              drag-drop
              :type="uploadInputType"
              accept=".csv"
              class="file-label"
              :class="$style.uploadButton"
              :disabled="pageDisabled"
              @input="readNewFile"
            >
              <b-loading :active="pageDisabled" :is-full-page="false">
                <BaseIcon :class="$style.loadingIcon" name="fan" spin />
              </b-loading>
              <section class="section">
                <div class="content has-text-centered">
                  <p>
                    <b-icon :icon="uploadInputIcon" size="is-large" />
                  </p>
                  <p v-if="uploadInputState === BUTTON_STATES.INVALID_FILE">
                    Le fichier <em>{{ file.name }}</em> semble corrompu.
                    <br />
                    <br />
                    Cliquez ou glissez pour uploader un autre fichier.
                  </p>
                  <p v-else>Cliquez ou glissez un fichier</p>
                </div>
              </section>
            </b-upload>
          </div>
        </div>
        <!-- If valid file -->
        <div
          v-else
          key="file"
          :class="[$style.fileDisplayContainer, $style.description]"
        >
          <h3 :class="$style.descriptionInstruction">
            <span :class="$style.importantText">Données:</span>
          </h3>
          <div class="box" :class="$style.fileDisplay">
            <h3 :class="$style.descriptionInstruction">
              <b-icon icon="file" size="is-large" />
              <em :class="$style.importantText">{{ file.name }}</em
              ><b-button
                icon-left="times"
                size="is-small"
                type="button"
                :class="$style.fileDeleteButton"
                @click="resetFile"
              />
            </h3>
          </div>
        </div>
      </Transition>

      <!-- Table section -->

      <Transition name="slide-fade">
        <div
          v-if="file && !fileError && parsedData && parsedData.length > 0"
          :class="$style.afterUpload"
        >
          <div>
            <Transition name="fade" mode="out-in">
              <div
                v-if="!fieldMapComplete"
                key="beforeSelect"
                :class="$style.description"
              >
                <h3 :class="$style.descriptionInstruction">
                  Quelle colonne contient les
                  <span :class="$style.importantText"
                    >emails des acheteurs</span
                  >
                  ?
                </h3>
                <p :class="$style.nottabene">
                  Faites attention, il y a parfois plusieurs colonnes d'email.
                </p>
              </div>
              <div v-else key="afterSelect" :class="$style.description">
                <h3 :class="$style.descriptionInstruction">
                  <span :class="$style.importantText">Emails des acheteurs</span
                  >:
                </h3>
              </div>
            </Transition>

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
        </div>
      </Transition>

      <Transition name="slide-fade">
        <div v-if="file && fieldMapComplete" :class="$style.conclusion">
          <div :class="$style.description">
            <h3 :class="$style.descriptionInstruction">
              Merci, toutes les données peuvent maintenant être envoyées au
              serveur
            </h3>
          </div>
          <div :class="$style.sendButtonContainer">
            <b-button
              :class="$style.sendButton"
              type="is-success"
              size="is-medium"
              :loading="pageDisabled"
              :disabled="pageDisabled"
              @click="send"
            >
              Envoyer →
            </b-button>
          </div>
        </div>
      </Transition>
    </div>
  </Layout>
</template>

<style lang="scss" module>
@import '@design';

.mainTitle {
  @extend .leftAlignedNarrow;

  padding-bottom: 1rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
  border-bottom: 2px solid black;
  p {
    padding: 0 1rem;
    margin-top: 1rem;
  }
}

.importantText {
  border-bottom: 1px solid black;
}

.description {
  @extend .leftAlignedNarrow;

  padding: 1rem;
  margin-top: 1rem;
  margin-bottom: 0;
}

.fileDisplayContainer {
  padding: 0 1rem;
  .fileDisplay {
    position: relative;
    margin-top: 1rem;

    .fileDeleteButton {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      opacity: 0;
    }
    &:hover .fileDeleteButton {
      opacity: 1;
    }
    @media screen and (max-width: $size-content-width-min) {
      .fileDeleteButton {
        opacity: 1;
      }
    }
  }
}

.upload {
  @extend .leftAlignedNarrow;

  .uploadButton {
    position: relative; // Keep the loader inside the container
  }

  padding: 0 1rem;
  text-align: center;
}

.conclusion {
  .sendButtonContainer {
    @extend .leftAlignedNarrow;

    padding: 0 1rem;
    text-align: right;
  }
}

.nottabene {
  font-size: 0.9em;
}

.leftAlignedNarrow {
  max-width: $size-content-width-min;
  margin-right: auto;
  margin-left: auto;
}
</style>
