<script>
import { mapState } from 'vuex'
import GroupDisplay from '@/src/components/group-display.vue'

export default {
  components: { GroupDisplay },
  props: {
    crossingId: {
      type: Number,
      required: true,
    },
  },
  computed: {
    ...mapState({
      groups: (state) => state.groupMaker.groups,
      groupMakerCrossingId: (state) => state.groupMaker.crossingId,
      deathList: (state) => state.deaths.deathList,
    }),
    showMakeButton() {
      return this.groupMakerCrossingId !== this.crossingId
    },
  },
  methods: {
    async createGroups() {
      const groups = await this.$store.dispatch('groupMaker/createGroups', {
        crossingId: this.crossingId,
        deaths: [...this.deathList],
      })

      return groups
    },
    async changeGroup({ profile, oldId, newId }) {
      await this.$store.dispatch('groupMaker/changeGroup', {
        profile,
        oldId,
        newId,
      })
    },
  },
}
</script>

<template>
  <div :class="$style.container">
    <div v-if="showMakeButton">
      <button @click="createGroups">create groups</button>
    </div>
    <div v-else>
      <div v-for="group of groups" :key="group.id">
        <GroupDisplay :group="group" @change-group="changeGroup" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@design';

.container {
  width: 100%;
  height: 100%;
  background-color: #fff;
}
</style>
