export const groupColorShapeMethods = {
  methods: {
    groupColor(groupId) {
      return ['blue', 'green', 'yellow'][Math.floor((groupId - 1) / 2)]
    },
    groupShape(groupId) {
      return ['square', 'circle'][(groupId - 1) % 2]
    },
  },
}
