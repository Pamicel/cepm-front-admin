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
    loading: {
      type: Boolean,
      defualt: false,
    },
  },
  methods: {
    formatDate(date, formatString) {
      return format(new Date(date), formatString, { locale: fr })
    },
    formatDuration,
  },
}
</script>

<template>
  <div :class="$style.container">
    <p>
      <b-button
        :disabled="loading"
        :loading="loading"
        :icon-right="crossing && crossing.archived ? 'box-open' : 'archive'"
        :type="crossing.archived ? 'is-info' : 'is-danger'"
        :outlined="!crossing.archived"
        size="is-small"
        @click="$emit('archive')"
        >{{ crossing.archived ? 'Réactiver' : 'Archiver' }}</b-button
      ></p
    >
    <h1
      >Traversée du
      {{ formatDate(new Date(crossing.startDate), "d MMM, H'h'mm") }}
      <span v-if="crossing.archived"> | archivée</span>
    </h1>

    <div :class="$style.infos">
      <br />
      <p
        >N°
        {{ new Intl.NumberFormat('fr-FR').format(crossing.crossingNumber) }}</p
      >
      <p>Date: {{ formatDate(new Date(crossing.startDate), 'd MMM yyyy') }}</p>
      <p>Départ: {{ formatDate(new Date(crossing.startDate), "H'h'mm") }}</p>
      <p>Durée: {{ formatDuration(crossing.duration) }}</p>
      <p>Jauge: {{ crossing.audienceSize }} personnes</p>
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@design';
.infos {
  padding-left: 0.5rem;
  .archived {
    text-decoration: underline;
  }
}
</style>
