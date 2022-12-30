<script>
import { groupColorShapeMethods } from '@utils/group-color-shape-methods.mixin'
import GroupProfile from './group-profile.vue'

export default {
  components: { GroupProfile },
  mixins: [groupColorShapeMethods],
  props: {
    group: {
      type: Object,
      required: true,
    },
  },
  methods: {
    changeGroup({ profile, oldId, newId }) {
      this.$emit('change-group', { profile, oldId, newId })
    },
  },
}
</script>

<template>
  <div :class="$style.container">
    <div :class="$style.header">
      <div
        :class="$style.logo"
        :data-shape="groupShape(group.id)"
        :data-color="groupColor(group.id)"
      ></div>
    </div>
    <div :class="$style.body">
      <div>{{ group.profiles.length }} personne(s)</div>
      <div v-for="profile of group.profiles" :key="profile.id">
        <GroupProfile
          :profile="profile"
          :group-id="group.id"
          @change-group="
            ({ newId }) => changeGroup({ profile, oldId: group.id, newId })
          "
        />
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
  .logo {
    width: 2rem;
    height: 2rem;
    &[data-color='blue'] {
      background-color: rgb(0, 79, 255);
    }
    &[data-color='green'] {
      background-color: green;
    }
    &[data-color='yellow'] {
      background-color: #fad02c;
    }
    &[data-shape='circle'] {
      border-radius: 100%;
    }
  }
}
</style>
