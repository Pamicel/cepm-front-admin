<script>
import FormField from '@components/form-field.vue'
import { mapState } from 'vuex'
import { fr } from 'date-fns/locale'
import { format } from 'date-fns'

export default {
  components: { FormField },
  props: {
    savedResponses: {
      type: Object,
      default: () => {},
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
      IMPORTANT_PEOPLE_ROLES: {
        FANTASM: 'Fantasme',
        FIRST_LOVE: 'Premier amour',
        SOULMATE: 'Âme sœure',
        PARTNER: 'Conjoint·e',
        FAMILY: 'Parent / Famille',
        FRIEND: 'Ami·e',
        LONG_LOST_FRIEND: "Ami·e d'antan",
        CELEBRITY: 'Célébrité',
        ENEMY: 'Pire énemi·e',
        DEVIL: 'Le mal en personne',
      },
      INTIMATE_PUBLIC: {
        COWARDICE: 'Lâcheté, culpabilité',
        COURAGE: 'Courage, honnêteté',
      },
    }

    return {
      constants,
      responses: this.createResponsesObject(this.savedResponses),
    }
  },
  computed: {
    ...mapState({
      fetchingFirm: (state) => state.deaths.fetchingDeaths,
      deathList: (state) => state.deaths.deathList,
    }),
    prettyBirthDate(state) {
      return state.savedResponses.birthDate
        ? this.formatDate(new Date(state.savedResponses.birthDate), 'MMM yyyy')
        : ''
    },
    importantPeople(state) {
      const { importantPeopleNames, importantPeopleRoles } = state.responses

      const importantPeople = []
      for (let n = 0; n < 3; n++) {
        const name = importantPeopleNames[n]
        const role = importantPeopleRoles[n]
        importantPeople.push({ name, role })
      }

      return importantPeople
    },
    loading() {
      return this.fetchingFirm
    },
  },
  watch: {
    savedResponses: {
      handler: function(savedResponses) {
        this.responses = this.createResponsesObject(savedResponses)

        //
        // Keep the following comment + command:
        //
        // The following console.log breaks the test that checks if this.response
        // was updated correctly, I suspect because the sum of all actions in this
        // function takes too long to compute.
        // Keep this comment and this line for future forensics if the same test
        // breaks (even without the console.log) on a less capable machine:
        // console.log(JSON.stringify(this.responses, null, 2))
        //
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    /**
     * For every response fill with the response given
     * as a prop in savedResponses and if it does not
     * exist, fill in with the default value.
     */
    createResponsesObject(savedResponses = {}) {
      const responseDefaults = {
        email: '',
        firstname: '',
        lastname: '',
        gender: '', // multiple choices
        birthDate: new Date(),
        birthPlace: {
          latitude: null,
          longitude: null,
        },
        crossingDate: null,
        afterLife: '', // multiple choices
        afterLifeMore: '',
        job: '',
        grievances: false,
        grievancesDetails: '',
        pet: false,
        petDetails: '',
        crossingType: '', // multiple choices
        importantPeopleRoles: ['', '', ''], // multiple choices for each
        importantPeopleNames: ['', '', ''],
        intimate: '', // multiple choices
        public: '', // multiple choices
        captcha: '', // multiple choices
        song: '',
        dream: false,
        dreamDetails: '',
        enemy: false,
        enemyDetails: '',
        remorse: false,
        remorseDetails: '',
        imageRights: false,
        fairUse: false,
      }

      const allEntries = [
        'email',
        'firstname',
        'lastname',
        'gender',
        'birthDate',
        'birthPlace',
        'crossingDate',
        'afterLife',
        'afterLifeMore',
        'job',
        'grievances',
        'grievancesDetails',
        'pet',
        'petDetails',
        'crossingType',
        'importantPeopleNames',
        'importantPeopleRoles',
        'intimate',
        'public',
        'captcha',
        'song',
        'dream',
        'dreamDetails',
        'enemy',
        'enemyDetails',
        'remorse',
        'remorseDetails',
        'imageRights',
      ]

      const responses = {}

      for (const key of allEntries) {
        responses[key] = savedResponses[key] || responseDefaults[key]
      }

      if (typeof responses.birthDate === 'string') {
        responses.birthDate = new Date(responses.birthDate)
      }
      if (typeof responses.birthPlace === 'string') {
        responses.birthPlace = JSON.parse(responses.birthPlace)
      }

      // make sure birthPlace, importantPeopleRoles and importantPeopleNames are not store objects
      responses.birthPlace = { ...responses.birthPlace }
      responses.importantPeopleRoles = [...responses.importantPeopleRoles]
      responses.importantPeopleNames = [...responses.importantPeopleNames]

      return {
        ...responses,
        fairUse: false,
      }
    },
    resetResponses() {
      this.responses = this.createResponsesObject(this.savedResponses)
    },
    detailedResponse(response, responseDetails) {
      if (responseDetails) {
        return `Oui: "${responseDetails}"`
      } else if (response) {
        return 'Oui'
      } else {
        return 'Non'
      }
    },
    formatDate(date, formatString) {
      return format(new Date(date), formatString, { locale: fr })
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

      <!-- FIRST NAME -->

      <FormField
        :class="$style.field"
        field-name="Prénom"
        :response="responses.firstname"
        required
      />

      <!-- LAST NAME -->

      <FormField
        :class="$style.field"
        field-name="Nom"
        :response="responses.lastname"
        required
      />
      <!-- BIRTH -->

      <FormField
        :class="$style.field"
        field-name="Né·e en"
        :response="prettyBirthDate"
        required
      />

      <!-- GENDER -->

      <FormField
        :class="$style.field"
        field-name="Sexe"
        :response="constants.GENDERS[responses.gender]"
        required
      />

      <!-- CROSSING DATE -->

      <FormField
        :class="$style.field"
        field-name="Date de traversée (indication)"
        :response="
          responses.crossingDate
            ? formatDate(responses.crossingDate, 'd MMM yyyy, H\'h\'mm')
            : '(Non selectionné)'
        "
      />
    </section>

    <section :class="$style.section">
      <h1 :class="$style.title">Situation</h1>

      <!-- JOB -->

      <FormField
        :class="$style.field"
        field-name="Quel métier exerciez-vous ?"
        :response="responses.job"
      />

      <!-- PET -->

      <FormField
        :class="$style.field"
        field-name="Aviez-vous un animal de compagnie ?"
        :response="detailedResponse(responses.pet, responses.petDetails)"
      />

      <!-- GRIEVANCES -->

      <FormField
        :class="$style.field"
        field-name="Aviez-vous des griefs envers quelqu'un ?"
        :response="
          detailedResponse(responses.grievances, responses.grievancesDetails)
        "
      />

      <!-- IMPORTANT PEOPLE -->

      <FormField
        :class="$style.field"
        field-name="Quelles étaient les 3 personnes qui comptaient le plus pour vous ?"
        :response="
          importantPeople.map(({ name, role }) => {
            if (name && role) {
              return `${name} (${constants.IMPORTANT_PEOPLE_ROLES[role]})`
            }
            return null
          })
        "
      />
    </section>

    <section :class="$style.section">
      <h1 :class="$style.title">
        Pour une traversée adéquate
      </h1>

      <!-- CROSSING TYPES -->

      <FormField
        :class="$style.field"
        field-name="Vous attendez de votre traversée qu'elle soit:"
        :response="constants.CROSSING_TYPES[responses.crossingType]"
        required
      />

      <!-- AFTER LIFE -->

      <FormField
        :class="$style.field"
        field-name="Que croyez-vous qu’il y a après ?"
        :response="constants.AFTER_LIVES[responses.afterLife]"
        required
      />

      <FormField
        v-if="responses.afterLife === 'OTHER'"
        :class="$style.field"
        field-name="Que croyez-vous qu’il y a après ? (Précisez)"
        :response="responses.afterLifeMore"
      />

      <!-- PUBLIC INTIMATE -->

      <FormField
        :class="$style.field"
        field-name="Associez instinctivement:"
        required
        :response="[
          `Sphère intime → ${constants.INTIMATE_PUBLIC[responses.intimate] ||
            '(pas de réponse)'}`,
          `Sphère publique → ${constants.INTIMATE_PUBLIC[responses.public] ||
            '(pas de réponse)'}`,
        ]"
      />
    </section>

    <section :class="$style.section">
      <h1 :class="$style.title">
        Pour une traversée optimale
      </h1>

      <!-- SONG -->

      <FormField
        :class="$style.field"
        field-name="Quelle était votre chanson préférée ?"
        :response="responses.song || ''"
      />

      <!-- DREAM -->

      <FormField
        :class="$style.field"
        field-name="Un rêve ou un cauchemar, récurrent ou récent ?"
        :response="detailedResponse(responses.dream, responses.dreamDetails)"
      />

      <!-- REMORSE -->

      <FormField
        :class="$style.field"
        field-name="Avez-vous un souvenir qui vous a laissé des remords ?"
        :response="
          detailedResponse(responses.remorse, responses.remorseDetails)
        "
      />
    </section>

    <section :class="$style.section">
      <FormField
        :class="$style.field"
        field-name="J'autorise le CEPM n°7 à utiliser des images dans lesquelles j’apparais
        pour ses archives internes."
        :response="responses.imageRights ? 'Oui' : 'Non'"
      />
    </section>

    <section :class="$style.section">
      <h1 :class="$style.title">
        Vérification (obligatoire)
      </h1>

      <FormField
        :class="$style.field"
        field-name="Que voyez-vous ci-dessous ?"
        :response="responses.captcha"
      />
      <img
        src="https://assets.359degres.com/candelabre.jpg"
        alt="Image d'un candelabre, eh oui!"
        :class="$style.candelabre"
      />
    </section>
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
