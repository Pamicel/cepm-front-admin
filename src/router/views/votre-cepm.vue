<script>
import Layout from '@layouts/main.vue'
import FooterFirmCta from '@components/footer-firm-cta.vue'

export default {
  page: {
    title: 'Votre CEPM',
    meta: [{ name: 'description', content: 'Informations sur votre CEPM' }],
  },
  components: { Layout, FooterFirmCta },
}
</script>

<template>
  <Layout>
    <div :class="$style.container">
      <div :class="$style.content">
        <h1>
          Informations
          <br />
          Coronavirus Covid-19
          <br />
          <img
            src="@assets/images/sars-cov-2.png"
            alt="artist rendering of the coronavirus"
            :class="$style.virus"
          />
        </h1>
        <h3>
          Votre CEPM traite actuellement un nombre important de traversées, les
          délais de prise en charge par nos services peuvents être allongés de
          quelques jours à quelques semaines, veuillez nous excuser de la gêne
          occasionnée.
        </h3>
      </div>
    </div>
    <FooterFirmCta slot="footer-extension" />
  </Layout>
</template>

<style lang="scss" module>
@import '@design';

.container {
  height: 100%;
  padding: $size-grid-padding;
  margin-top: 2rem;
  margin-bottom: 2rem;
  background-color: red;
}
.content {
  @extend %narrow-content;
  .virus {
    width: 1em;
  }
}
</style>
