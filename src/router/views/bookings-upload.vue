<script>
import Layout from '@layouts/local.vue'
import BookingsUpload from '@components/bookings-upload.vue'

export default {
  components: { Layout, BookingsUpload },
  page: {
    title: 'Field Map Selector',
    meta: [{ name: 'description', content: 'The Field Map Selector page.' }],
  },
  methods: {
    done() {
      this.$router.push({
        name: 'bookings',
        params: { id: this.crossing.id },
      })
    },
  },
}
</script>

<template>
  <Layout>
    <BookingsUpload :crossing-id="$route.params.id" @done="done" />
  </Layout>
</template>

<style lang="scss" module>
@import '@design';

.mainTitle {
  @extend .leftAlignedNarrow;

  padding-bottom: 1rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
  border-bottom: 2px solid black;
  p {
    padding: 0 1rem;
    margin-top: 1rem;
  }
}

.importantText {
  border-bottom: 1px solid black;
}

.description {
  @extend .leftAlignedNarrow;

  padding: 1rem;
  margin-top: 1rem;
  margin-bottom: 0;
}

.fileDisplayContainer {
  padding: 0 1rem;
  .fileDisplay {
    position: relative;
    margin-top: 1rem;

    .fileDeleteButton {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      opacity: 0;
    }
    &:hover .fileDeleteButton {
      opacity: 1;
    }
    @media screen and (max-width: $size-content-width-min) {
      .fileDeleteButton {
        opacity: 1;
      }
    }
  }
}

.upload {
  @extend .leftAlignedNarrow;

  .uploadButton {
    position: relative; // Keep the loader inside the container
  }

  padding: 0 1rem;
  text-align: center;
}

.conclusion {
  .sendButtonContainer {
    @extend .leftAlignedNarrow;

    padding: 0 1rem;
    text-align: right;
  }
}

.nottabene {
  font-size: 0.9em;
}

.leftAlignedNarrow {
  max-width: $size-content-width-min;
  margin-right: auto;
  margin-left: auto;
}
</style>
