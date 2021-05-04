<script>
import SqdaQuestion from '@components/sqda-question.vue'

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
  computed: {
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
        })
      }

      return qList.filter((q) => !q.disabled)
    },
    displayedQuestions() {
      return this.groupedQuestions.filter((q) => !q.hide)
    },
    hiddenQuestions() {
      return this.groupedQuestions.filter((q) => q.hide)
    },
  },
}
</script>

<template>
  <div :class="$style.container">
    <SqdaQuestion
      v-for="question in displayedQuestions.filter((q) => !q.hide)"
      :key="question.question"
      :class="$style.cell"
      v-bind="question"
    />
    <div v-if="hiddenQuestions.length > 0">
      <hr />
      <h2>Questions cachées</h2>
      <SqdaQuestion
        v-for="question in hiddenQuestions.filter((q) => q.hide)"
        :key="question.question"
        :class="$style.cell"
        v-bind="question"
      />
    </div>
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
}
</style>
