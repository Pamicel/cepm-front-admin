<script>
import formatDate from '@utils/format-date.js'
import formatHour from '@utils/format-hour.js'
import formatDuration from '@utils/format-duration.js'

export default {
  props: {
    crossing: {
      type: Object,
      required: true,
    },
  },
  methods: {
    formatDate,
    formatHour,
    formatDuration,
  },
}
</script>

<template>
  <div :class="$style.container">
    <h1>Traversée {{ crossing.id }}</h1>
    <div :class="$style.infos">
      <p
        >Date: {{ formatDate(new Date(crossing.startDate)) }}
        {{ formatHour(new Date(crossing.startDate)) }}</p
      >
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
