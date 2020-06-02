<script>
import Layout from '@layouts/local.vue'

export default {
  page() {
    return {
      title: this.user.name,
      meta: [
        {
          name: 'description',
          content: `The user profile for ${this.user.name}.`,
        },
      ],
    }
  },
  components: { Layout },
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
}
</script>

<template>
  <Layout narrow>
    <h1>
      {{ user.name }}
    </h1>
    <pre>{{ user }}</pre>
  </Layout>
</template>
