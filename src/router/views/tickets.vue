<script>
import Layout from '@layouts/local.vue'

const deathIdcWords = [
  'dehors',
  'manteau',
  'blouse',
  'stagiaire',
  'parcours',
  'autonomie',
  'attente',
  'cabine',
  'espace',
  'manger',
  'banane',
  'ordinateur',
  'tranquillement',
  'bataille',
  'ensemble',
  'toilette',
  'dents',
  'coiffe',
  'visage',
  'maquillage',
  'beaucoup',
  'trop',
  'doute',
  'uniforme',
  'retard',
  'silence',
  'revues',
  'climatisation',
  'annonce',
  'respect',
  'environnement',
  'pourquoi',
  'dossier',
  'continu',
  'cadre',
  'suite',
  'souhait',
  'songe',
  'remarque',
  'temps',
  'badge',
  'document',
  'main',
  'sonne',
  'personne',
  'surveille',
  'donne',
  'communique',
]

const crossingIdWords = [
  'projection',
  'mortel',
  'optimal',
  'couleur',
  'forme',
  'appel',
  'face',
  'presque',
  'fleur',
  'bilan',
]

export default {
  page: {
    title: 'Tickets',
    meta: [{ name: 'description', content: 'The Tickets page.' }],
  },
  components: { Layout },
  data() {
    const crossingId =
      this.$route.query && this.$route.query.t ? +this.$route.query.t - 1 : 0
    const number =
      this.$route.query && this.$route.query.n ? +this.$route.query.n : 30

    return {
      number,
      crossingWord: crossingIdWords[crossingId % crossingIdWords.length],
      deathIdcWords,
      crossingIdWords,
    }
  },
  computed: {
    tickets(state) {
      const tickets = []
      for (let i = 0; i < this.number; i++) {
        tickets.push({
          idc: `${i + 1}`.padStart(2, '0'),
          crossingWord: this.crossingWord,
          idcWord: this.deathIdcWords[i % this.deathIdcWords.length],
        })
      }
      return tickets
    },
  },
}
</script>

<template>
  <Layout>
    <div :class="$style.container">
      <div :class="$style.controls">
        Jauge:
        <b-input v-model="number" type="number" />
        <br />
        Mot de traversée:
        <b-select v-model="crossingWord" placeholder="Mot de traversée" rounded>
          <option v-for="word of crossingIdWords" :key="word">{{
            word
          }}</option>
        </b-select>
      </div>
      <div :class="$style.ticketList">
        <div v-for="tik of tickets" :key="tik.idc" :class="$style.ticket">
          <div :class="$style.logo">
            <img
              src="@assets/images/cepm-logo-stamp-small.svg"
              alt="logo du CEPM"
            />
          </div>
          <div :class="$style.infos">
            <div :class="[$style.idc, $style.infoLine]">
              DCD-{{ tik.idc }}
            </div>
            <div :class="[$style.idcWord, $style.infoLine]"
              >Mot de Passage:
              <span :class="$style.word">{{ tik.idcWord }}</span></div
            >
            <div :class="[$style.crossingWord, $style.infoLine]"
              >Mot de traversée:
              <span :class="$style.word">{{ tik.crossingWord }}</span></div
            >
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<style lang="scss" module>
@import '@design';
.container {
  .controls {
    max-width: $size-content-width-max;
    margin: auto;
  }

  padding: $size-grid-padding;
  background-color: white;
  .ticketList {
    display: flex;
    flex-wrap: wrap;
    max-width: 29.7cm;
    margin: 1rem auto;
    border: 1px solid black;
    .ticket {
      display: flex;
      width: 50%;
      border: 1px solid black;
      .logo {
        width: 30%;
        height: 100%;
        padding: 1em;
      }
      .infos {
        width: 50%;
        padding: 1em;
        .infoLine {
          margin: 0.5em 0;
        }
        .idcWord,
        .crossingWord {
          font-size: 1.2em;
        }
        .word {
          font-weight: bold;
        }
      }
      .idc {
        font-size: 2rem;
        font-weight: bold;
      }
    }
  }
}
</style>
