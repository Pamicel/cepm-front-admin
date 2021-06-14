<script>
import LockedFirmDisplay from '@components/locked-firm-display.vue'
import { getCrossingNumber } from '@utils/crossingNumber.js'

export default {
  components: {
    LockedFirmDisplay,
  },
  props: {
    death: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    fullCrossingNumber(state) {
      if (state.death.crossingId) {
        return getCrossingNumber(state.death.crossingId)
      }
      return null
    },
  },
}
</script>

<template>
  <div :class="$style.container">
    <div :class="$style.firmDisplayHeader">
      <h2 v-if="fullCrossingNumber" :class="$style.firmDisplaySubtitle"
        >Traversée {{ fullCrossingNumber }}</h2
      >
      <h1 v-if="death.idc" :class="$style.firmDisplayTitle"
        >DCD-{{ death.idc }}</h1
      >
    </div>
    <LockedFirmDisplay
      v-if="death.deathForm"
      :saved-responses="death.deathForm"
    />
  </div>
</template>

<style lang="scss" module>
@import '@design';
.container {
  .firmDisplayHeader {
    margin-bottom: 2rem;
    text-align: center;
  }
  .firmDisplayTitle {
    color: white;
    @extend %typography-large;
  }
  .firmDisplaySubtitle {
    color: white;
    @extend %typography-medium;
  }

  padding: $size-grid-padding;
  background-color: grey;
}
</style>
