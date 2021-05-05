<script>
import Layout from '@layouts/local.vue'
import SqdaTable from '@/src/components/sqda-table.vue'
import SqdaQuestionForm from '@components/sqda-question-form.vue'
import CollapseForm from '@components/collapse-form.vue'

import { mapState } from 'vuex'

export default {
  page: {
    title: 'Sqda Questions',
    meta: [{ name: 'description', content: 'The Sqda Questions page.' }],
  },
  components: { Layout, SqdaTable, CollapseForm, SqdaQuestionForm },
  data() {
    return {
      isFormOpen: false,
    }
  },
  computed: {
    ...mapState('sqda', {
      questions: (state) => state.questions,
      fetchingQuestions: (state) => state.fetchingQuestions,
    }),
  },
  beforeMount() {
    this.$store.dispatch('sqda/fetchQuestions')
  },
}
</script>

<template>
  <Layout>
    <div :class="$style.container">
      <h1 :class="$style.title">
        SQDA
        <BaseIcon
          v-show="fetchingQuestions"
          :class="$style.loader"
          name="hourglass-half"
          spin
        />
      </h1>
      <CollapseForm :form-open.sync="isFormOpen" title="+ Créer une question">
        <SqdaQuestionForm @done="isFormOpen = false" />
      </CollapseForm>
      <SqdaTable :questions="questions" />
    </div>
  </Layout>
</template>

<style lang="scss" module>
@import '@design';
.container {
  @extend %narrow-content;

  padding: $size-grid-padding;

  .title {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    .loader {
      margin-left: 0.8em;
      font-size: 0.6em;
      opacity: 0.3;
    }
  }
}
</style>
