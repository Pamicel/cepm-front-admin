<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/local.vue'

export default {
  page: {
    title: 'Accueil',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: { Layout },
}
</script>

<template>
  <Layout :class="$style.container">
    <!-- section 1 -->
    <div :class="$style.hello">
      <img
        :class="$style.helloLogo"
        src="@assets/images/target.svg"
        alt="logo de l'application"
      />
      <span :class="$style.helloText">
        <h3>Bienvenue sur</h3>
        <h1>Calme</h1>
        <h4
          >La <span :class="$style.helloTextAccent">c</span>onsole de l'<span
            :class="$style.helloTextAccent"
            >al</span
          >gorithme <span :class="$style.helloTextAccent">me</span>rveilleux</h4
        >
        <br />
      </span>
      <b-button
        :class="$style.button"
        rounded
        type="is-large"
        @click="$router.push('login')"
      >
        Entrer
      </b-button>
    </div>
  </Layout>
</template>

<style lang="scss" module>
@import '@design';

.button {
  @include embossed_paper_shadow(2);

  background-color: $color-body-bg;
  border: 0;
  transition: all 200ms ease-in-out;
  &:hover {
    @include embossed_paper_shadow(3);
  }
}

.hello {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 100%;
  padding-top: 5rem;
  margin: 4rem 0;
  text-align: center;

  .helloLogo {
    height: 10vh;
  }
  .helloText {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 1rem 0;
    border-radius: 2rem;

    $size: 25rem;
    .helloTextAccent {
      border-bottom: 1px solid black;
    }
    > * {
      margin: 0;
    }
    h1 {
      // margin-bottom: 0.5rem;
    }
  }
}
</style>
