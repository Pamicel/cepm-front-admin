<script>
import Layout from '@layouts/local.vue'
import SqdaTable from '@/src/components/sqda-table.vue'

export default {
  page: {
    title: 'Sqda Questions',
    meta: [{ name: 'description', content: 'The Sqda Questions page.' }],
  },
  components: { Layout, SqdaTable },
}
</script>

<template>
  <Layout>
    <div :class="$style.container">
      <h1 :class="$style.title">
        SQDA
      </h1>
      <SqdaTable />
    </div>
  </Layout>
</template>

<style lang="scss" module>
@import '@design';
.container {
  @extend %narrow-content;

  padding: $size-grid-padding;

  .title {
    margin-bottom: 1rem;
  }
}
</style>
