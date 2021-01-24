<script>
import formatDuration from '@utils/format-duration.js'
import { fr } from 'date-fns/locale'
import { format } from 'date-fns'

export default {
  props: {
    crossing: {
      type: Object,
      required: true,
    },
  },
  methods: {
    formatDate(date) {
      return format(new Date(date), "d MMM yyyy, H'h'mm", { locale: fr })
    },
    formatDuration,
  },
}
</script>

<template>
  <div :class="$style.container">
    <h1
      >Traversée
      {{ new Intl.NumberFormat('fr-FR').format(crossing.crossingNumber) }}</h1
    >
    <div :class="$style.infos">
      <p>Date: {{ formatDate(new Date(crossing.startDate)) }}</p>
      <p>Durée: {{ formatDuration(crossing.duration) }}</p>
      <p>Jauge: {{ crossing.audienceSize }} personnes</p>
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@design';
.infos {
  padding-left: 0.5rem;
}
</style>
