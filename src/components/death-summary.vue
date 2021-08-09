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
    select() {
      this.$emit('select')
    },
  },
}
</script>

<template>
  <div :class="$style.container">
    <div :class="$style.idc">
      <b-tag type="is-dark" size="is-large"
        >DCD-{{ death.idc.toString().padStart(2, '0') }}</b-tag
      >
    </div>
    <!-- <div>
      Mot de passage: <b-tag>{{ death.idcWord }}</b-tag>
    </div> -->
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
        <b-button size="is-small" type="is-success" @click="select"
          >FIRM complet (ouvrir)</b-button
        >
      </div>
      <div v-if="death.deathForm && !death.deathForm.filled">
        <b-button size="is-small" type="is-info" @click="select"
          >Firm associé (ouvrir)</b-button
        >
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@design';
.container {
  @extend %comic-box;

  display: flex;
  flex-wrap: wrap;
  align-content: space-between;
  justify-content: space-between;
  min-height: 7.5rem;
  padding: $size-grid-padding;
  margin-bottom: $size-grid-padding;

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
</style>
