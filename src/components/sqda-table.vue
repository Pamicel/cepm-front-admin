<script>
import SqdaQuestion from '@components/sqda-question.vue'
import { mapState } from 'vuex'

export default {
  components: {
    SqdaQuestion,
  },
  props: {
    questions: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      showAnswersFor: null,
    }
  },
  computed: {
    ...mapState({
      fetchingAnswers: (state) => state.sqda.fetchingAnswers,
      answers: (state) => state.sqda.answers,
    }),
    groupedQuestions() {
      const qList = []

      for (const sqdaQuestion of this.questions) {
        const familyIds = [sqdaQuestion.id]
        const versions = [sqdaQuestion]

        const findMember = () =>
          this.questions.find(
            (q) => !familyIds.includes(q.id) && familyIds.includes(q.replacedBy)
          )
        let member = findMember()

        while (member) {
          familyIds.push(member.id)
          versions.push(member)
          member = findMember()
        }
        qList.push({
          ...sqdaQuestion,
          versions,
          familyIds,
        })
      }

      return qList
        .filter((q) => !q.disabled)
        .sort((qa, qb) => Math.min(...qb.familyIds) - Math.min(...qa.familyIds))
    },
  },
  methods: {
    fetchAnswers(questionId) {
      this.showAnswersFor = questionId
      this.$store.dispatch('sqda/fetchQuestionAnswers', { questionId })
    },
  },
}
</script>

<template>
  <div :class="$style.container">
    <SqdaQuestion
      v-for="question in groupedQuestions"
      :key="question.id"
      :class="$style.cell"
      v-bind="question"
      @show-answers="() => fetchAnswers(question.id)"
    />
    <b-modal :active="!!showAnswersFor" @close="showAnswersFor = null">
      <div :class="$style.modalContent">
        <div v-if="fetchingAnswers">
          <BaseIcon name="hourglass-half" spin />
        </div>
        <div v-else-if="answers.length > 0">
          <div v-for="answer of answers" :key="answer.id">
            <pre>{{ answer.answer }}</pre>
            <br />
          </div>
        </div>
        <div v-else>
          Aucune réponse
        </div>
      </div>
    </b-modal>
  </div>
</template>

<style lang="scss" module>
@import '@design';
.container {
  .cell {
    @include embossed_paper_shadow(2);

    margin: 2rem 0;
    border-radius: 8px;
  }
  .modalContent {
    min-height: 80vh;
    padding: $size-grid-padding;
    background-color: white;
  }
}
</style>
