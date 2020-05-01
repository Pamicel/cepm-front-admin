<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main.vue'

export default {
  page: {
    title: 'Accueil',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: { Layout },
}
</script>

<template>
  <Layout>
    <!-- section 1 -->
    <div :class="$style.cover">
      <span :class="$style.coverText">
        <h1>Bienvenue sur le site du CEPM</h1>
        <h2>Le service public d’accompagnement post-mortem</h2>
      </span>
    </div>
    <!-- section 2 -->
    <div :class="$style.links">
      <div>
        <h3 :class="$style.linksTitle">
          Vos démarches
        </h3>
        <h4 :class="$style.linksSubtitle">
          Mourir en toute sérénité
        </h4>
      </div>
      <div>
        <h3 :class="$style.linksTitle">
          Votre CEPM
        </h3>
        <h4 :class="$style.linksSubtitle">
          De quel CEPM dépendez-vous ?
        </h4>
      </div>
      <div>
        <h3 :class="$style.linksTitle">
          À propos
        </h3>
        <h4 :class="$style.linksSubtitle">
          Découvrez l’histoire du CEPM
        </h4>
      </div>
    </div>
    <!-- section 3 -->
    <div :class="$style.cta">
      <div :class="$style.ctaText">
        <h2>
          N'attendez pas vos derniers instants
        </h2>
        <p>
          Remplissez votre
          <em>Formulaire individuel de recensement mortem</em> dès maintenant
        </p>
        <BaseButton :class="$style.ctaButton" @click="$router.push('/login')">
          Remplir >
        </BaseButton>
      </div>
      <div :class="$style.ctaImage"> </div>
    </div>
  </Layout>
</template>

<style lang="scss" module>
@import '@design';

.cover {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  text-align: center;
  background-image: url('~@assets/images/beach.jpg');
  background-position: center 20%;
  background-size: cover;
  .coverText {
    text-shadow: rgba(0, 0, 0, 0.4) 0 4px 5px;
    h1 {
      margin-bottom: 0;
      font-size: 4em;
      line-height: 1.1em;
    }
    h2 {
      margin-top: 1rem;
    }
  }
}

.links {
  display: flex;
  justify-content: space-evenly;
  color: white;
  > :nth-child(1) {
    background-color: $color-b;
  }
  > :nth-child(2) {
    background-color: $color-a;
  }
  > :nth-child(3) {
    background-color: $color-c;
  }
  .linksTitle {
    margin: 0;
  }
  .linksSubtitle {
    margin: 0;
  }
  > * {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: 180px;
    padding: $size-grid-padding;
    text-align: center;
  }
}

.cta {
  display: flex;
  height: 580px;
  $text-width: 40%;
  .ctaText {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: $text-width;
    padding: $size-grid-padding;
    text-align: center;
    background-color: $color-c;

    > * {
      max-width: 20rem;
    }
    h2 {
      margin: 0;
      font-size: 2.5em;
      line-height: 1.5em;
    }
    p {
      font-size: 1.5em;
      line-height: 1.5em;
    }
  }
  .ctaImage {
    width: 100% - $text-width;
    overflow: hidden;
    background-image: url('~@assets/images/hands.jpg');
    background-position: center;
    background-size: cover;
  }

  .ctaButton {
    padding: ($size-grid-padding / 2) $size-grid-padding;
    font-size: 1.2em;
  }
}
</style>
