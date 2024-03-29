---
to: "src/router/views/<%= h.changeCase.kebab(name) %>.vue"
---
<%
  const fileName = h.changeCase.kebab(name)
  const importName = h.changeCase.pascal(fileName)
  const titleName = h.changeCase.title(name)
%><script>
import Layout from '@layouts/local.vue'

export default {
  page: {
    title: '<%= titleName %>',
    meta: [{ name: 'description', content: 'The <%= titleName %> page.' }],
  },
  components: { Layout }
}
</script>

<template>
  <Layout>
    <div :class="$style.container">
      <%= titleName %>
    </div>
  </Layout>
</template>
<%

if (useStyles) { %>
<style lang="scss" module>
@import '@design';
</style>
<% } %>
