<script>
import Layout from '@layouts/main.vue'

export default {
  page: {
    title: 'Mes Traversees',
    meta: [{ name: 'description', content: 'The Mes Traversees page.' }],
  },
  components: { Layout },
  computed: {
    traversees() {
      const today = new Date()
      const dates = []
      const numberOfDates = 30

      const addDays = (date, days) => {
        var result = new Date(date)
        result.setDate(result.getDate() + days)
        return result
      }
      for (let i = 0; i < numberOfDates; i++) {
        const date = addDays(today, i)
        date.setMinutes(0)
        date.setHours(19)
        dates.push(new Date(date))
        date.setHours(20)
        dates.push(new Date(date))
      }

      return dates
    },
  },
  methods: {
    getTraverseeNumber(date) {
      const marne = new Date(1914, 8, 13)
      const numberOfTraverseesSince = Math.round(
        (date - marne) / (30 * 60 * 1000) // one every 30 minutes
      )

      return numberOfTraverseesSince.toString(16).toUpperCase()
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
      <h3>Vous n'avez reservé aucune traversée pour le moment</h3>
      <h1>
        Prochaines Traversées
      </h1>
      <div
        v-for="date in traversees"
        :key="date.getTime()"
        :class="$style.traversee"
      >
        <div :class="$style.traverseeInfos">
          <span :class="$style.traverseeInfosNum">{{
            getTraverseeNumber(date)
          }}</span>
          <br />
          <span :class="$style.traverseeInfosDate">
            {{ date | moment('ddd Do MMM') }}
          </span>
          |
          <span :class="$style.traverseeInfosHour">
            {{ date | moment('HH') }}h
          </span>
        </div>
        <div :class="$style.traverseeButton">
          <BaseButton disabled>
            Traversée pleine <BaseIcon name="ban" />
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
