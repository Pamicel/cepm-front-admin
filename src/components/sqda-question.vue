<script>
import { formatRelative, format } from 'date-fns'
import { fr } from 'date-fns/locale'

export default {
  props: {
    question: {
      type: String,
      required: true,
    },
    answers: {
      type: Array,
      default: () => [],
    },
    versions: {
      type: Array,
      default: () => [],
    },
    dateCreated: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      showAnswers: false,
      showVersions: false,
      showMenu: false,
    }
  },
  methods: {
    formatDate(date) {
      return format(new Date(date), 'd MMM yyyy, H:mm O', { locale: fr })
    },
    formatRelative(date) {
      return formatRelative(new Date(date), new Date(), { locale: fr })
    },
    toggleAnswers() {
      this.showAnswers = !this.showAnswers
    },
    toggleVersions() {
      this.showVersions = !this.showVersions
    },
    toggleMenu() {
      this.showMenu = !this.showMenu
    },
  },
}
</script>

<template>
  <div :class="$style.container">
    <!-- Question -->
    <div :class="$style.questionInfos">
      <button :class="$style.menuToggleButton" @click="toggleMenu">
        <Transition name="rotate-fade" mode="out-in">
          <BaseIcon v-if="showMenu" key="on" name="times" />
          <BaseIcon v-else key="off" name="ellipsis-v" />
        </Transition>
      </button>
      <div :class="$style.infos">
        <div :class="{ [$style.menu]: true, [$style.menuHidden]: !showMenu }">
          <!-- Created -->
          <div
            :class="$style.date"
            :title="dateCreated ? formatDate(dateCreated) : '(date inconnue)'"
          >
            Date de création/modification:
            {{ dateCreated ? formatRelative(dateCreated) : '(date inconnue)' }}
          </div>
          <!-- Delete -->
          <b-button type="is-dark is-small" :class="$style.menuButton">
            <BaseIcon name="trash-alt" /> Supprimer
          </b-button>
          <!-- Modify -->
          <b-button type="is-dark is-small" :class="$style.menuButton">
            <BaseIcon name="pencil-alt" /> Modifier
          </b-button>
          <!-- History -->
          <!-- <b-button
              type="is-dark"
              :class="$style.menuButton"
              @click="toggleVersions"
              >Versions</b-button
            >
            <div v-if="showVersions">
              {{ versions }}
            </div> -->
        </div>
        <h2 :class="$style.question">
          {{ question }}
        </h2>
      </div>
      <div :class="$style.answersInfos">
        {{ answers.length || 'Pas de' }} réponse{{
          answers.length > 1 ? 's' : ''
        }}
        <br />
        <button
          v-if="answers.length > 0"
          :class="$style.answersButton"
          @click="toggleAnswers"
        >
          voir les réponses
        </button>
      </div>
    </div>
    <Transition name="slide-fade" mode="out-in">
      <div v-if="showAnswers" :class="$style.answers">
        <hr />
        <!-- Answers -->
        {{ answers }}
      </div>
    </Transition>
  </div>
</template>

<style lang="scss" module>
@import '@design';
.container {
  position: relative;
  padding: 1.5em;
  .menuToggleButton {
    position: absolute;
    top: 1em;
    right: 0.5em;
    cursor: pointer;
    background: none;
    border: 0;
    opacity: 0.4;
  }

  .questionInfos {
    .question {
      @extend %typography-medium;

      line-height: 1.4em;
    }
    .menu {
      max-height: 5rem;
      margin-right: 1rem;
      margin-bottom: 1rem;
      overflow: hidden;
      text-align: right;
      transition: all 200ms;
      &.menuHidden {
        max-height: 0;
        margin-bottom: 0;
      }
      .date {
        @extend %typography-xsmall;

        margin-bottom: 0.5rem;
        opacity: 0.4;
      }
      .menuButton {
        margin-left: 0.4rem;
      }
    }

    display: flex;
    flex-direction: column;
    // align-items: flex-end;
    justify-content: space-between;
    .answersInfos {
      // @extend %typography-large;
      // height: 2.5em;
      text-align: right;
      .answersButton {
        padding: 0;
        cursor: pointer;
        background: 0;
        border: 0;
        border-bottom: 1px solid black;
      }
    }
  }
}
</style>
