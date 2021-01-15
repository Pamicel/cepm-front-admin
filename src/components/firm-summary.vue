<script>
import { formatRelative, format } from 'date-fns'
import { fr } from 'date-fns/locale'

export default {
  props: {
    firstname: {
      type: String,
      default: null,
    },
    lastname: {
      type: String,
      default: null,
    },
    dateCreated: {
      type: String,
      default: null,
    },
    dateModified: {
      type: String,
      default: null,
    },
  },
  methods: {
    formatRelative(date) {
      return formatRelative(new Date(date), new Date(), { locale: fr })
    },
    formatDate(date) {
      return format(new Date(date), 'd MMM yyyy, H:mm O', { locale: fr })
    },
  },
}
</script>

<template>
  <div :class="$style.container">
    <div :class="$style.icon">
      <b-icon icon="clipboard-list" />
    </div>
    <div :class="$style.infos">
      <div :class="$style.field">
        <span :class="$style.fieldTitle">Nom:</span>
        {{ lastname || '(vide)' }}
      </div>
      <div :class="$style.field">
        <span :class="$style.fieldTitle">Prénom:</span>
        {{ firstname || '(vide)' }}
      </div>
      <div
        :class="$style.field"
        :title="dateCreated ? formatDate(dateCreated) : '(date inconnue)'"
      >
        <span :class="$style.fieldTitle">Rempli:</span>
        {{ dateCreated ? formatRelative(dateCreated) : '(date inconnue)' }}
      </div>
      <div
        v-if="dateModified && dateCreated !== dateModified"
        :class="$style.field"
        :title="formatDate(dateModified)"
      >
        <span :class="$style.fieldTitle">Modifié:</span>
        {{ formatRelative(dateModified) }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@design';
.container {
  display: flex;
  flex-direction: row;
  padding: 0.5rem;
  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
  }
  .field {
    @extend %typography-small;

    font-weight: bold;
    .fieldTitle {
      font-size: 0.8rem;
      font-weight: normal;
    }
  }
}
</style>
