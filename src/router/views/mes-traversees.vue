<script>
import Layout from '@layouts/local.vue'
const NUMBER_OF_TRAVERSEES_PER_DAY = 33

export default {
  page: {
    title: 'Mes Traversees',
    meta: [{ name: 'description', content: 'The Mes Traversees page.' }],
  },
  components: { Layout },
  computed: {
    traversees() {
      const today = new Date()
      const traversees = []
      const numberOfDates = 30

      const addDays = (date, days) => {
        var result = new Date(date)
        result.setDate(result.getDate() + days)
        return result
      }
      const createTraversee = (numberThatDay, date) => {
        return {
          numberThatDay,
          date,
        }
      }

      for (let i = 0; i < numberOfDates; i++) {
        const date = addDays(today, i)
        date.setHours(15)
        date.setMinutes(0)
        traversees.push(createTraversee(1, new Date(date)))
        date.setHours(17)
        date.setMinutes(30)
        traversees.push(createTraversee(25, new Date(date)))
        date.setHours(20)
        date.setMinutes(0)
        traversees.push(createTraversee(33, new Date(date)))
      }

      return traversees
    },
  },
  methods: {
    getTraverseeNumber(traversee) {
      const { date, numberThatDay } = traversee
      const marne = new Date(1914, 8, 13, 12, 0)
      const numberOfDaysSince = Math.round(
        (date - marne) / (24 * 60 * 60 * 1000)
      )
      const numberOfTraverseesSince =
        numberOfDaysSince * NUMBER_OF_TRAVERSEES_PER_DAY

      return numberOfTraverseesSince + numberThatDay
    },
  },
}
</script>

<template>
  <Layout narrow padded>
    <div :class="$style.container">
      <h1>
        Mes Traversées
      </h1>
      <h3>Vous n'avez réservé aucune traversée pour le moment</h3>
      <h1>
        Prochaines Traversées
      </h1>
      <div
        v-for="traversee in traversees"
        :key="traversee.date.getTime()"
        :class="$style.traversee"
      >
        <div :class="$style.traverseeInfos">
          <span :class="$style.traverseeInfosNum">{{
            getTraverseeNumber(traversee)
          }}</span>
          <br />
          <span :class="$style.traverseeInfosDate">
            {{ traversee.date | moment('ddd Do MMM') }}
          </span>
          |
          <span :class="$style.traverseeInfosHour">
            {{ traversee.date | moment('HH') }}h{{
              traversee.date | moment('mm')
            }}
          </span>
        </div>
        <div :class="$style.traverseeButton">
          <BaseButton disabled>
            Traversée pleine
          </BaseButton>
        </div>
      </div>
    </div>
  </Layout>
</template>

<style lang="scss" module>
@import '@design';
.container {
  .traversee {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: $size-grid-padding;
    margin: ($size-grid-padding / 2) 0;
    color: black;
    background-color: white;
    .traverseeInfos {
      min-width: 15em;
      .traverseeInfosNum {
        font-family: monospace;
      }
      .traverseeInfosDate {
        font-size: 1.5em;
      }
    }
    .traverseeButton {
      width: 100%;
      margin-right: 1em;
      text-align: right;
      button:disabled {
        color: black;
        background-color: lightgrey;
      }
    }
  }
}
</style>
