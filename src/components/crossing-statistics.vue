<script>
import { mapState } from 'vuex'

export default {
  props: {
    crossingId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      constants: {
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
      },
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
    currentYear() {
      return new Date().getFullYear()
    },
    deathForms(state) {
      return state.deathList.map((d) => d.deathForm).filter(Boolean)
    },
    stats(state) {
      const genders = {}
      const commonYOB = {}
      const allYearsOfBirth = []
      const crossingTypes = {}
      const afterLives = {}
      const captchas = {}
      const jobs = []
      let grievances = 0

      for (const df of this.deathForms) {
        if (df.gender) {
          genders[df.gender] = genders[df.gender] ? genders[df.gender] + 1 : 1
        }
        if (df.birthDate) {
          const dateOfBirth = new Date(df.birthDate)
          const yearOfBirth = dateOfBirth.getFullYear()
          const halfDecade = Math.floor(yearOfBirth / 10) * 10
          commonYOB[halfDecade] = commonYOB[halfDecade]
            ? commonYOB[halfDecade] + 1
            : 1
          allYearsOfBirth.push(yearOfBirth)
        }
        if (df.crossingType) {
          crossingTypes[df.crossingType] = crossingTypes[df.crossingType]
            ? crossingTypes[df.crossingType] + 1
            : 1
        }
        if (df.afterLife) {
          afterLives[df.afterLife] = afterLives[df.afterLife]
            ? afterLives[df.afterLife] + 1
            : 1
        }
        if (df.captcha) {
          captchas[df.captcha] = captchas[df.captcha]
            ? captchas[df.captcha] + 1
            : 1
        }
        grievances += df.grievances ? 1 : 0
        if (df.job) {
          jobs.push(df.job)
        }
      }

      return {
        genders,
        avgYOB: Math.round(
          allYearsOfBirth.reduce((acc, val) => acc + val, 0) /
            allYearsOfBirth.length
        ),
        sortedYOB: Object.entries(commonYOB)
          .sort((a, b) => (parseInt(a[0]) <= parseInt(b[0]) ? 1 : -1))
          .map((e) => ({ year: e[0], number: e[1] })),
        afterLives,
        crossingTypes,
        grievances: this.percent(grievances, this.deathForms.length),
        captchas,
        jobs: jobs.sort(),
      }
    },
  },
  async mounted() {
    if (!this.crossing || this.crossing.id !== this.crossingId) {
      await this.$store.dispatch('crossings/fetchCrossings')
    }
    this.$store.dispatch('deaths/fetchDeaths', {
      crossingId: this.crossingId,
    })
  },
  methods: {
    percent(val, total) {
      return Math.round((100 * val) / total)
    },
  },
}
</script>

<template>
  <div :class="$style.container">
    <h1 :class="$style.title">Statistiques <BaseIcon name="chart-bar"/></h1>

    <section :class="$style.section">
      <!-- Sex -->
      <h2 :class="$style.sectionTitle">Sexes</h2>
      <div v-for="g of Object.keys(stats.genders)" :key="g">
        {{ constants.GENDERS[g] }}:
        {{ percent(stats.genders[g], deathForms.length) }}%
        <b-progress
          size="is-small"
          :value="percent(stats.genders[g], deathForms.length)"
        ></b-progress>
      </div>
    </section>
    <hr />

    <section :class="$style.section">
      <!-- Most common year of birth -->
      <h2 :class="$style.sectionTitle">Décénies de naissance</h2>
      <div v-for="entry of stats.sortedYOB" :key="entry.year"
        >{{ entry.year }} →
        {{ Math.min(parseInt(entry.year) + 10, currentYear) }}:
        {{ percent(entry.number, deathForms.length) }}%
        <b-progress
          size="is-small"
          :value="percent(entry.number, deathForms.length)"
        ></b-progress>
      </div>
      <p :class="$style.avgAge"
        >Moyenne d'âge de décès {{ currentYear - stats.avgYOB }} ans</p
      >
    </section>
    <hr />

    <section :class="$style.section">
      <!-- Afterlife -->
      <h2 :class="$style.sectionTitle">Croient à</h2>
      <div v-for="al of Object.keys(stats.afterLives)" :key="al">
        {{ constants.AFTER_LIVES[al] }}:
        {{ percent(stats.afterLives[al], deathForms.length) }}%
        <b-progress
          size="is-small"
          :value="percent(stats.afterLives[al], deathForms.length)"
        ></b-progress>
      </div>
    </section>
    <hr />

    <section :class="$style.section">
      <!-- Jobs -->
      <h2 :class="$style.sectionTitle">Métiers</h2>
      <div>
        <b-tag
          v-for="job of stats.jobs"
          :key="job"
          :class="$style.jobTag"
          type="is-dark"
          size="is-large"
          >{{ job }}</b-tag
        >
      </div>
    </section>
    <hr />

    <section :class="$style.section">
      <!-- Most popular crossingType -->
      <h2 :class="$style.sectionTitle">Types de traversées</h2>
      <div v-for="ct of Object.keys(stats.crossingTypes)" :key="ct">
        {{ constants.CROSSING_TYPES[ct] }}:
        {{ percent(stats.crossingTypes[ct], deathForms.length) }}%
        <b-progress
          size="is-small"
          :value="percent(stats.crossingTypes[ct], deathForms.length)"
        ></b-progress>
      </div>
    </section>
    <hr />

    <section :class="$style.section">
      <!-- Grievances -->
      <h2 :class="$style.sectionTitle">Griefs</h2>
      <div>{{ stats.grievances }}%</div>
      <b-progress size="is-small" :value="stats.grievances"></b-progress>
    </section>
    <hr />

    <section :class="$style.section">
      <!-- Captcha -->
      <h2 :class="$style.sectionTitle">Vérification</h2>
      <img
        src="https://assets.359degres.com/candelabre.jpg"
        alt="Image d'un candelabre, eh oui!"
        :class="$style.candelabre"
      />
      <div v-for="choice of Object.keys(stats.captchas)" :key="choice">
        {{ choice }}: {{ stats.captchas[choice] }}
        <b-progress
          size="is-small"
          :value="percent(stats.captchas[choice], deathForms.length)"
        ></b-progress>
      </div>
    </section>
  </div>
</template>

<style lang="scss" module>
@import '@design';
.container {
  max-width: $size-content-width-max;
  padding: $size-grid-padding 2rem;
  margin: auto;
  background-color: #fff;
  .title {
    padding: 0 0 $size-grid-padding 0;
    margin-bottom: $size-grid-padding;
    border-bottom: 4px solid black;
  }
  .section {
    @extend %typography-medium;

    margin-bottom: 1em;

    .sectionTitle {
      @extend %typography-large;

      position: relative;
      margin-bottom: 0.2em;
    }

    .avgAge {
      margin: 0.5em 0 0;
      background-color: yellow;
    }

    .jobTag {
      margin: 0.4em;
    }

    .candelabre {
      display: block;
      max-width: 10rem;
      margin: auto;
      border-radius: 8px;
    }
  }
}
</style>
