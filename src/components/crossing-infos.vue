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
    <br />
    <h1
      >Traversée du
      {{ formatDate(new Date(crossing.startDate), "d MMM, H'h'mm") }}
      <span v-if="crossing.archived">
        | archivée <BaseIcon name="archive" />
      </span>
    </h1>
    <div :class="$style.infos">
      <!-- <br /> -->
      <p :class="$style.importantInfo"
        >N°
        {{ new Intl.NumberFormat('fr-FR').format(crossing.crossingNumber) }} — «
        {{ crossing.idWord }} »</p
      >
      <p>Date: {{ formatDate(new Date(crossing.startDate), 'd MMM yyyy') }}</p>
      <p>Départ: {{ formatDate(new Date(crossing.startDate), "H'h'mm") }}</p>
      <p>Durée: {{ formatDuration(crossing.duration) }}</p>
      <p>Jauge: {{ crossing.audienceSize }} personnes</p>
      <p :class="$style.archiveButton">
        <b-button
          :disabled="loading"
          :loading="loading"
          :icon-right="crossing && crossing.archived ? 'box-open' : 'archive'"
          :type="crossing.archived ? 'is-warning' : 'is-info'"
          size="is-small"
          @click="$emit('archive')"
          >{{
            crossing.archived
              ? 'Réactiver la traversée'
              : 'Archiver la traversée'
          }}</b-button
        ></p
      >
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@design';
.container {
  position: relative;
  padding-bottom: $size-grid-padding;
  border-bottom: 1px solid black;
  .archiveButton {
    position: absolute;
    right: $size-grid-padding;
    bottom: $size-grid-padding;
  }
  .infos {
    padding-left: 0.5rem;
    .archived {
      text-decoration: underline;
    }
    .importantInfo {
      @extend %typography-medium;

      font-weight: bold;
    }
  }
}
</style>
