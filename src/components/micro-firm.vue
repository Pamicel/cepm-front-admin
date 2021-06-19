<script>
import FormField from '@components/form-field.vue'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { mapState } from 'vuex'

export default {
  components: { FormField },
  props: {
    deathId: {
      type: Number,
      required: true,
    },
  },
  data() {
    const constants = {
      GENDERS: {
        M: 'Masculin',
        F: 'Féminin',
        OTHER: 'Autre',
      },
      AFTER_LIVES: {
        CEPM: 'CEPM',
        PARADISE: 'Paradis',
        HELL: 'Enfer',
        VOID: 'Néant',
        REINCARNATION: 'Réincarnation',
        STAR: 'Catastérisation (transformation en étoile)',
        END_OF_TIMES: 'Eschatologie',
        FOREVER_AGAIN: 'Éternel retour',
        IMMORTALITY: 'Immortalité',
        MÉTEMPSYCOSE: 'Métempsycose',
        MORMONISM: 'Plan de salut',
        PUNARBHAVA: 'Punarbhava',
        ORIGINAL_BUDDHISM: 'Renaissance selon le bouddhisme originel',
        UNKNOWN: 'L’inconnu',
        SOUL_ERECTION: "Remontée de l'âme",
        RESURRECTION: 'Résurrection',
        RETRIBUTION: 'Rétribution des âmes',
        TRANSMIGRATION: 'Transmigration des âmes',
        ETERNAL_OBLIVION: 'Oubli éternel',
        MEMORY_ETERNAL: 'Mémoire éternelle',
        NEUTRAL: 'Existence neutre',
        LARVAL: 'Existence larvaire',
        DEMONIZATION: 'Démonisation',
        DAMNATION: 'Damnation',
        SALVATION: 'Salut',
        OTHER: 'Autre...',
      },
      CAPTCHA_CHOICES: ['Une Buse', 'Un Livre', 'Un Candélabre'],
      CROSSING_TYPES: {
        DARK: 'Sombre',
        SOFT: 'Douce',
        HAPPY: 'Joyeuse',
        FUNNY: 'Drôle',
        EXCITING: 'Excitante',
        MOVING: 'Émouvante',
        HILARIOUS: 'Désopilante',
        INSURMONTABLE: 'Insurmontable',
        GRUELING: 'Éreintante',
        AMAZING: 'Merveilleuse',
      },
      MONTHS: [
        'Janvier',
        'Février',
        'Mars',
        'Avril',
        'Mai',
        'Juin',
        'Juillet',
        'Août',
        'Septembre',
        'Octobre',
        'Novembre',
        'Décembre',
      ],
    }

    return {
      constants,
      responses: {},
      editMode: true,
    }
  },
  computed: {
    ...mapState({
      sendingDeathForm: (state) => state.deaths.sendingDeathForm,
    }),
    loading() {
      return this.sendingDeathForm.includes(this.deathId)
    },
    last120Years: () => {
      const currentYear = new Date().getFullYear()
      return new Array(120).fill().map((e, index, array) => currentYear - index)
    },
  },
  methods: {
    formatDate(date) {
      return format(new Date(date), "d MMM yyyy, H'h'mm", { locale: fr })
    },
    send() {
      const { responses } = this
      // Clean up the responses
      const content = {
        gender: responses.gender,
        birthDate:
          responses.birthYear !== undefined
            ? new Date(
                responses.birthYear,
                responses.birthMonth === undefined ? 5 : responses.birthMonth
              )
            : undefined,

        afterLife: responses.afterLife,
        job: responses.job,
        grievances: responses.grievances,
        crossingType: responses.crossingType,
        captcha: responses.captcha,
        dream: responses.dream,
      }

      this.$buefy.dialog.confirm({
        message: `
              <p><strong>Êtes-vous sûr·e de vouloir envoyer le formulaire ?</strong></p>
            `,
        title: 'Terminer la démarche',
        confirmText: 'Envoyer',
        onConfirm: () => this.sendFirm(content),
        cancelText: 'Annuler',
      })
    },
    async sendFirm(form) {
      const res = await this.$store.dispatch('deaths/sendDeathForm', {
        form,
        deathId: this.deathId,
      })
      if (res) {
        this.$buefy.toast.open({
          message: 'Reçu',
          type: 'is-success',
        })
        this.$emit('done')
      } else {
        this.$buefy.toast.open({
          message: 'Un problème est survenu, réessayez',
          type: 'is-danger',
        })
      }
      return res
    },
  },
}
</script>

<template>
  <div :class="$style.container">
    <section :class="$style.section" :data-disabled="true">
      <h1 :class="$style.title">
        Identification
      </h1>

      <!-- BIRTH -->

      <FormField :class="$style.field" field-name="Mois de naissance" edit>
        <b-select v-model="responses.birthMonth" placeholder="Selectionner">
          <option
            v-for="index in Object.keys(constants.MONTHS)"
            :key="index"
            :value="index"
            >{{ constants.MONTHS[index] }}</option
          >
        </b-select>
      </FormField>

      <FormField :class="$style.field" field-name="Année de naissance" edit>
        <b-select v-model="responses.birthYear" placeholder="Selectionner">
          <option v-for="year of last120Years" :key="year" :value="year">{{
            year
          }}</option>
        </b-select>
      </FormField>

      <!-- GENDER -->

      <FormField :class="$style.field" field-name="Sexe" edit>
        <b-field grouped>
          <b-select v-model="responses.gender" placeholder="Selectionner">
            <option
              v-for="index of Object.keys(constants.GENDERS)"
              :key="index"
              :value="index"
              >{{ constants.GENDERS[index] }}</option
            >
          </b-select>
        </b-field>
      </FormField>
    </section>

    <section :class="$style.section">
      <h1 :class="$style.title">Situation</h1>

      <!-- JOB -->

      <FormField
        :class="$style.field"
        field-name="Quel métier exerciez-vous ?"
        edit
      >
        <b-input v-model="responses.job"></b-input>
      </FormField>

      <!-- GRIEVANCES -->

      <FormField
        :class="$style.field"
        field-name="Aviez-vous des griefs envers quelqu'un ?"
        edit
      >
        <div>
          <b-field>
            <b-radio-button
              v-model="responses.grievances"
              :native-value="true"
              type="is-success"
            >
              <span>Oui</span>
            </b-radio-button>
            <b-radio-button
              v-model="responses.grievances"
              :native-value="false"
              type="is-danger"
            >
              <span>Non</span>
            </b-radio-button>
          </b-field>
        </div>
      </FormField>
    </section>

    <section :class="$style.section">
      <h1 :class="$style.title">
        Pour une traversée optimale
      </h1>

      <FormField
        :class="$style.field"
        field-name="Un rêve ou un cauchemar, récurrent ou récent ?"
        edit
      >
        <div>
          <b-field>
            <b-radio-button
              v-model="responses.dream"
              :native-value="true"
              type="is-success"
            >
              <span>Oui</span>
            </b-radio-button>
            <b-radio-button
              v-model="responses.dream"
              :native-value="false"
              type="is-danger"
            >
              <span>Non</span>
            </b-radio-button>
          </b-field>
        </div>
      </FormField>
    </section>

    <section :class="$style.section">
      <h1 :class="$style.title">
        Pour une traversée adéquate
      </h1>

      <!-- CROSSING TYPES -->

      <FormField
        :class="$style.field"
        field-name="Vous attendez de votre traversée qu'elle soit:"
        edit
      >
        <div
          v-for="[key, type] in Object.entries(constants.CROSSING_TYPES)"
          :key="type"
          class="field"
        >
          <b-radio v-model="responses.crossingType" :native-value="key">
            {{ type }}
          </b-radio>
        </div>
      </FormField>

      <!-- AFTER LIFE -->

      <FormField
        :class="$style.field"
        field-name="Que croyez-vous qu’il y a après ?"
        edit
      >
        <b-select v-model="responses.afterLife">
          <option :value="''" default disabled>choisir...</option>
          <option
            v-for="choice in Object.keys(constants.AFTER_LIVES)"
            :key="choice"
            :value="choice"
          >
            {{ constants.AFTER_LIVES[choice] }}
          </option>
        </b-select>
      </FormField>
    </section>

    <section :class="$style.section">
      <h1 :class="$style.title">
        Vérification
      </h1>

      <FormField
        :class="$style.field"
        field-name="Que voyez-vous ci-dessous ?"
        edit
      >
        <div
          v-for="answer in constants.CAPTCHA_CHOICES"
          :key="answer"
          class="field"
        >
          <b-radio v-model="responses.captcha" :native-value="answer">
            {{ answer }}
          </b-radio>
        </div>
      </FormField>
      <img
        src="https://assets.359degres.com/candelabre.jpg"
        alt="Image d'un candelabre, eh oui!"
        :class="$style.candelabre"
      />
    </section>

    <div :class="$style.buttonContainer">
      <div :class="$style.button">
        <b-button
          size="is-medium"
          :disabled="loading"
          :loading="loading"
          @click="send"
          >Envoyer</b-button
        >
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@design';

.container {
  width: $size-content-width-max;
  max-width: 100%;
  margin: 0 auto 2rem;
  text-align: center;
  @media screen and (max-width: $size-breakpoint-small) {
    padding: $size-grid-padding;
  }

  .head > * {
    color: black;
  }

  text-align: left;
  .mainTitle {
    font-size: 2rem;
    line-height: 2.4rem;
  }
  .subTitle {
    font-size: 1.5rem;
    line-height: 1.7rem;
  }
}
.datepicker {
  text-align: center;
}
.section {
  padding: 1rem 2rem 2rem;
  margin: 1rem 0;
  text-align: left;
  background-color: white;
  .title {
    @extend %typography-medium;

    margin-bottom: 1rem;
  }
  .field {
    margin-bottom: 1rem;
    &:last-child {
      margin-bottom: 0;
    }
  }
}
.signature {
  color: red;
  .title {
    color: red;
  }
}

.button {
  text-align: right;
  .cancelButton {
    margin-right: 0.5rem;
  }
}
.importantPeople {
  padding-bottom: 1em;
  margin: 1em 0;
  border-bottom: 1px solid white;
  &:last-child {
    padding-bottom: 0;
    border: none;
  }
}
.candelabre {
  display: block;
  max-width: 10rem;
  margin: auto;
  border-radius: 8px;
}
</style>
