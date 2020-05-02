<script>
import Layout from '@layouts/main.vue'
import FormCard from '@components/form-card.vue'

export default {
  page: {
    title: 'Démarches',
    meta: [
      { name: 'description', content: 'Vos formulaires et démarches au CEPM.' },
    ],
  },
  components: { Layout, FormCard },
}
</script>

<template>
  <Layout narrow>
    <div :class="$style.container">
      <h2 :class="$style.pageTitle">Vos démarches</h2>
      <FormCard
        :id="$style.firm"
        :class="$style.formCard"
        acronym="FIRM"
        full-name="Formulaire de recensement mortem"
        message="Il est important de remplir le FIRM pour décéder en toute légalité."
        unavailable
        @to-form="$router.push('firm')"
      />
      <FormCard
        :id="$style.sqda"
        :class="$style.formCard"
        acronym="SQDA"
        full-name="Sondage qualitatif de l'antécédent"
        message="Remplissez le SQDA pour aider le CEPM à améliorer son service auprès des usagers."
        unavailable
        @to-form="$router.push('sqda')"
      />
    </div>
  </Layout>
</template>

<style lang="scss" module>
@import '@design';

.pageTitle {
  text-align: center;
}
#firm {
  background-color: $color-b;
}
#sqda {
  background-color: $color-c;
}
</style>
