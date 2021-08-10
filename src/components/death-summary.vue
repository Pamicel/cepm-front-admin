<script>
export default {
  props: {
    death: {
      type: Object,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    openUserPanel() {
      this.$emit('openUserPanel')
    },
    openMicroFirm() {
      this.$emit('openMicroFirm')
    },
    displayDeath() {
      this.$emit('display')
    },
    deselectActivity(activity) {
      this.$emit('deselectActivity', activity)
    },
    selectActivity(activity) {
      this.$emit('selectActivity', activity)
    },
  },
}
</script>

<template>
  <div :class="$style.container">
    <div :class="$style.mainInfos">
      <div :class="$style.idc">
        <b-tag type="is-dark" size="is-large"
          >DCD-{{ death.idc.toString().padStart(2, '0') }}</b-tag
        >
      </div>
      <div :class="$style.actions">
        <div v-if="!death.deathForm" :class="$style.newFirm">
          <b-button
            type="is-link"
            size="is-small"
            icon-right="paperclip"
            :loading="loading"
            :disabled="loading"
            @click="() => openUserPanel(death)"
            >Associer un FIRM</b-button
          >
        </div>
        <div v-if="!death.deathForm" :class="$style.newFirm">
          <b-button
            type="is-warning"
            size="is-small"
            icon-right="plus"
            :class="$style.firmExpressButton"
            :loading="loading"
            :disabled="loading"
            @click="() => openMicroFirm(death.id)"
            >Faire un FIRM Express</b-button
          >
        </div>
        <div
          v-if="death.deathForm && death.deathForm.filled"
          :class="$style.newFirm"
        >
          <b-button size="is-small" type="is-success" @click="displayDeath"
            >FIRM complet (ouvrir)</b-button
          >
        </div>
        <div v-if="death.deathForm && !death.deathForm.filled">
          <b-button size="is-small" type="is-info" @click="displayDeath"
            >Firm associé (ouvrir)</b-button
          >
        </div>
      </div>
    </div>
    <div :class="$style.otherInfos">
      <div
        v-if="
          death.deathForm &&
            death.deathForm.dream &&
            death.deathForm.dreamDetails
        "
        :class="$style.dreamDetails"
      >
        <span :class="$style.dreamDetailsTitle">Rêve : </span
        >{{ `"${death.deathForm.dreamDetails.trim()}"`.slice(0, 200).trim()
        }}<span v-if="death.deathForm.dreamDetails.length > 200"
          >...
          <br />
          <b-button
            v-if="death.deathForm.dreamDetails.length > 200"
            rounded
            :class="$style.readButton"
            type="is-dark"
            size="is-small"
            @click="displayDeath"
            >lire en entier dans le firm</b-button
          >
        </span>
      </div>
      <div :class="$style.activities">
        <b-button
          :type="death.selectedFor.includes('rebirth') ? 'is-success' : ''"
          :disabled="loading"
          :loading="loading"
          :icon-right="death.selectedFor.includes('rebirth') ? 'check' : ''"
          rounded
          :class="$style.activityButton"
          @click="
            () =>
              death.selectedFor.includes('rebirth')
                ? deselectActivity('rebirth')
                : selectActivity('rebirth')
          "
          >P</b-button
        >
        <b-button
          :type="death.selectedFor.includes('message') ? 'is-success' : ''"
          :disabled="loading"
          :loading="loading"
          :icon-right="death.selectedFor.includes('message') ? 'check' : ''"
          rounded
          :class="$style.activityButton"
          @click="
            () =>
              death.selectedFor.includes('message')
                ? deselectActivity('message')
                : selectActivity('message')
          "
          >UM</b-button
        >
        <b-button
          :type="death.selectedFor.includes('dream') ? 'is-success' : ''"
          :disabled="loading"
          :loading="loading"
          :icon-right="death.selectedFor.includes('dream') ? 'check' : ''"
          rounded
          :class="$style.activityButton"
          @click="
            () =>
              death.selectedFor.includes('dream')
                ? deselectActivity('dream')
                : selectActivity('dream')
          "
          >R</b-button
        >
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@design';
.container {
  @extend %comic-box;

  min-height: 7.5rem;
  padding: $size-grid-padding;
  margin-bottom: $size-grid-padding;

  .activities {
    margin-top: 0.5rem;
    .activityButton {
      margin-right: 0.5rem;
      font-weight: bold;
    }
  }

  .mainInfos {
    display: flex;
    flex-wrap: wrap;
    align-content: space-between;
    justify-content: space-between;

    .idc {
      min-width: 10rem;
    }
    .actions {
      text-align: right;
      > * {
        margin-top: 0.5rem;
      }
    }
  }
  .otherInfos {
    .dreamDetails {
      position: relative;
      padding: 0.5rem $size-grid-padding;
      margin-top: $size-grid-padding;
      background-color: #eee;
      border-radius: $size-grid-padding;
      .dreamDetailsTitle {
        font-weight: bold;
      }
      .readButton {
        position: absolute;
        right: 0.5rem;
        bottom: 0.5rem;
      }
    }
  }
}
</style>
