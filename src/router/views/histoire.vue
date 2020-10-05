<script>
import Layout from '@layouts/local.vue'
import FooterFirmCta from '@components/footer-firm-cta.vue'

export default {
  page: {
    title: 'Histoire',
    meta: [
      {
        name: 'description',
        content: 'Le CEPM, une histoire sociale et humaine',
      },
    ],
  },
  components: { Layout, FooterFirmCta },
}
</script>

<template>
  <Layout>
    <div :class="$style.container">
      <div :class="$style.title">
        <h2>Le CEPM, une histoire sociale et humaine</h2>
      </div>
      <div :class="$style.content">
        <video
          controls
          src="@assets/videos/histoire-cepm.mp4"
          :class="$style.contentVideo"
          type="video/mp4"
        ></video>
        <p>
          Le premier <em>Centre Évaluatif Post-Mortem</em> voit le jour en 1914
          à la suite d’un décret officiel et confidentiel de Raymond Poincaré,
          en réponse au déclenchement de la Première Guerre Mondiale et au bilan
          meurtrier de la bataille de la Marne.
        </p>
        <p>
          La hausse du taux de mortalité due aux épidémies, aux morts
          infanto-juvéniles et bien évidemment aux guerres successives incluant
          la dernière guerre d’Algérie en 1962, pousse l’Etat à organiser la
          <em>prise en charge post-mortem des français</em>.
        </p>
        <p>
          C’est donc un
          <em>établissement public à vocation évaluative et sociale</em> qui est
          créé afin d’accueillir et d’orienter les passagers nouvellement
          décédés vers la <em>Grande Suite</em>.
        </p>
        <img
          :class="$style.contentImg"
          src="@assets/images/histoire/infirmieres.jpg"
          alt="Infirmières s'occupants de nouveaux-nés au tournant du XXème siècle."
        />
        <img
          :class="$style.contentImg"
          src="@assets/images/histoire/parlement.jpg"
          alt="Photo de l'hemicycle du Parlement à cette même période sur laquelle figure George Pompidou."
        />
        <p>
          <em>Entre 1945 et 1975</em>, période communément appelée les Trente
          Glorieuses, un accroissement significatif de la natalité, dit aussi
          <em>“Baby Boom”</em>, pousse les pouvoirs publics, en la personne de
          George Pompidou, alors directeur de cabinet puis Premier Ministre du
          Général De Gaulle, à prendre le problème à bras le corps.
        </p>
        <img
          :class="$style.contentImg"
          src="@assets/images/histoire/papy-boom.jpg"
          alt="
            Graphiques au sujet du papy boom.

            D'ici 2050, 25% de la population devrait être agée de 65 ans ou plus
            (Source Population DESA, United Nations - 2011).

            En 2011 il y avait 1,5 millions de personnes agées de plus de 80 ans
            Ils devraient être 6,1 millions en 2035, dont 1,2 millions de personnes
            en perte d'autonomie (Source Synerpa).

            Les dépense totales de soins par habitant et par classe d'âge en 2008
            présentait une évolution exponentielle de 1000 euros à 20 ans à près
            de 8000 euros à 90 ans (Source Sécurité sociale).
          "
        />
        <p>
          <em>Anticipant sur les futurs décès</em> de cette génération,
          autrement dit le <em>“Papy Boom”</em> et les engorgements potentiels
          dans la Grande Suite, il augmente la dotation des CEPM et les élargit
          jusqu’à atteindre le nombre de <em>14 centres</em> répartis de façon
          homogène sur tout le territoire (métropole et Outre-mer).
        </p>
        <img
          :class="$style.contentImg"
          src="@assets/images/histoire/taux-dependance.jpg"
          alt="Graphe au sujet du taux de dépendance. Difficile à déchiffrer. (Source Eurostat 2011)"
        />
      </div>
      <FooterFirmCta slot="footer-extension" />
    </div>
  </Layout>
</template>

<style lang="scss" module>
@import '@design';

.container {
  .title {
    max-width: 30rem;
    margin: auto;
    text-align: center;
  }
  .content {
    @extend %narrow-content;

    font-size: 1.2em;
    line-height: 1.3em;
    text-align: justify;

    em {
      background-color: $color-a;
    }

    .contentImg,
    .contentVideo {
      display: block;
      max-width: 80%;
      margin: 3rem auto;
    }
  }
}
</style>
