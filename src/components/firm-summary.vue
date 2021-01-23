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
    loading: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    formatRelative(date) {
      return formatRelative(new Date(date), new Date(), { locale: fr })
    },
    formatDate(date) {
      return format(new Date(date), 'd MMM yyyy, H:mm O', { locale: fr })
    },
    choose() {
      this.$emit('choose')
    },
  },
}
</script>

<template>
  <div :data-loading="loading" :class="$style.container">
    <div :class="$style.icon">
      <b-icon icon="clipboard-list" />
    </div>
    <div :class="$style.infos">
      <div :class="$style.field">
        <span :class="$style.fieldTitle">Nom:</span>
        <span :class="$style.fieldContent">{{ lastname || '(vide)' }}</span>
      </div>
      <div :class="$style.field">
        <span :class="$style.fieldTitle">Prénom:</span>
        <span :class="$style.fieldContent">{{ firstname || '(vide)' }}</span>
      </div>
      <div
        :class="$style.field"
        :title="dateCreated ? formatDate(dateCreated) : '(date inconnue)'"
      >
        <span :class="$style.fieldTitle">Rempli:</span>
        <span :class="$style.fieldContent">{{
          dateCreated ? formatRelative(dateCreated) : '(date inconnue)'
        }}</span>
      </div>
      <div
        v-if="dateModified && dateCreated !== dateModified"
        :class="$style.field"
        :title="formatDate(dateModified)"
      >
        <span :class="$style.fieldTitle">Modifié:</span>
        <span :class="$style.fieldContent">{{
          formatRelative(dateModified)
        }}</span>
      </div>
    </div>
    <div :class="$style.buttonContainer">
      <BaseActionButton
        :class="$style.button"
        :disabled="loading"
        @click="choose"
        >Utiliser ce FIRM</BaseActionButton
      >
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
  .infos {
    flex-grow: 1;
  }

  .field {
    @extend %typography-small;

    font-weight: bold;
    .fieldTitle {
      font-size: 0.8rem;
      font-weight: normal;
    }
    .fieldContent {
      margin-left: 0.3em;
    }
  }
  // Loading skeleton animation
  &[data-loading='true'] .fieldContent {
    color: transparent;
    background: white;
    animation: pulse 2s infinite;
  }
  .field:nth-child(1) .fieldContent {
    animation-delay: 0s;
  }
  .field:nth-child(2) .fieldContent {
    animation-delay: 0.2s;
  }
  .field:nth-child(3) .fieldContent {
    animation-delay: 0.4s;
  }
  @keyframes pulse {
    0% {
      opacity: 0.5;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0.5;
    }
  }
}
</style>
