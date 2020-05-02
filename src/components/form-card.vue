<script>
export default {
  props: {
    acronym: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    unavailable: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<template>
  <div :class="$style.container">
    <div :class="$style.description">
      <div :class="$style.formAcronym">
        <h2>
          {{ acronym }}
        </h2>
      </div>
      <div :class="$style.formDetails">
        <h4 :class="$style.formFullName">
          {{ fullName }}
        </h4>
        <p :class="$style.formMessage">
          {{ message }}
        </p>
      </div>
    </div>
    <div :class="$style.action">
      <BaseButton
        :disabled="unavailable"
        :class="$style.actionButton"
        @click="$emit('to-form')"
      >
        Remplir
      </BaseButton>
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@design';

.container {
  $description-width: 75%;

  display: flex;
  flex-direction: row;

  /*
    Cards are supposed to be stacked on top of each other and look
    like an old <table> element
    This is why &:not(:last-child) { border-bottom: 0 }
  */
  border: 2px solid white;
  &:not(:last-child) {
    border-bottom: 0;
  }

  .description {
    width: $description-width;
    .formAcronym {
      max-width: 12rem;
      padding: $size-grid-padding;
      background-color: rgba(255, 255, 255, 0.3);
      h2 {
        width: 100%;
        margin: 1rem 0;
        text-align: center;
      }
    }
    .formDetails {
      padding: $size-grid-padding;

      .formFullName {
        margin: 0;
      }
      .formMessage {
        margin-top: 0;
      }
    }
  }
  .action {
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    width: 100% - $description-width;
    padding: $size-grid-padding;
    .actionButton {
      font-size: 1.2rem;
      background-color: transparent;
      border: 1px solid white;
      border-radius: 0.2rem;
    }
  }
}
</style>
