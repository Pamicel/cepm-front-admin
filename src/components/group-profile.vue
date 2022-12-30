<script>
import { groupColorShapeMethods } from '@utils/group-color-shape-methods.mixin'

export default {
  mixins: [groupColorShapeMethods],
  props: {
    groupId: {
      type: Number,
      required: true,
    },
    profile: {
      type: Object,
      required: true,
    },
  },
}
</script>

<template>
  <div :class="$style.container">
    DCD-{{ profile.original.idc }}
    <button
      v-for="num of [1, 2, 3, 4, 5, 6].filter((id) => id !== groupId)"
      :key="num"
      :class="$style.groupChangeButton"
      :data-color="groupColor(num)"
      :data-shape="groupShape(num)"
      @click="() => $emit('change-group', { newId: num })"
    ></button>
  </div>
</template>

<style lang="scss" module>
@import '@design';
.groupChangeButton {
  width: 1.2rem;
  height: 1.2rem;
  margin-right: 0.2rem;
  border: 0;
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
</style>
