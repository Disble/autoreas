<script>
import { mdiFolderOpen, mdiLink, mdiMinus, mdiPlus, mdiWeatherSunny } from "@mdi/js";

import Button from "svelte-materialify/src/components/Button";

import Card from "svelte-materialify/src/components/Card";
import CardActions from "svelte-materialify/src/components/Card/CardActions.svelte";
import CardSubtitle from "svelte-materialify/src/components/Card/CardSubtitle.svelte";
import CardTitle from "svelte-materialify/src/components/Card/CardTitle.svelte";
import Col from "svelte-materialify/src/components/Grid/Col.svelte";
import Row from "svelte-materialify/src/components/Grid/Row.svelte";
import Icon from "svelte-materialify/src/components/Icon";


export let anime;

const getState = estado => {
  const states = {
    0: 'Viendo',
    1: 'Finalizado',
    2: 'No me gusto',
    3: 'En pausa'
  }
  return states[estado] || "Sin estado";
}
const handleEpisodeCounter = () => {
  if (anime.totalcap && anime.totalcap > 0) {
    let episodesRemaining = anime.totalcap - anime.nrocapvisto < 0 ? 0 : anime.totalcap - anime.nrocapvisto;
    return episodesRemaining === 0 ? `Ya no quedan más capítulos` : `${episodesRemaining} capítulos restantes`;
  } else {
    return `${anime.nrocapvisto} capítulos vistos`;
  }
};
const handleOpenFolder = e => {
  console.log('handleOpenFolder', e);
}
const handleOpenLink = e => {
  console.log('handleOpenLink', e);
}
const handleOpenState = e => {
  console.log('handleOpenState', e);
}
const handleReverseEpisodeCounter = e => {
  console.log('reverseEpisodeCounter', e);
  episodeCounter = handleEpisodeCounter();
}
$: episodeCounter = `${anime.nrocapvisto} capítulos vistos`;
</script>

<Card class="white">
  <Row noGutters>
    <Col style="max-width: 100px">
      <!-- <img src="img/before_dawn.svg" alt="cover" /> -->
      <div class="ver-img-card" style="background-image: url('img/before_dawn.svg')"></div>
    </Col>
    <Col cols={7}>
      <Row noGutters>
        <Col>
          <CardTitle class="text-subtitle-2 title-card">{anime.nombre}</CardTitle>
          <CardSubtitle class="text-subtitle-2 pt-1">
            <span
              on:mouseenter={handleReverseEpisodeCounter}
              on:mouseleave={() => episodeCounter = `${anime.nrocapvisto} capítulos vistos`}
            >{episodeCounter}</span> <span class="grey-text">• {getState(anime.estado)}</span>
          </CardSubtitle>
        </Col>
      </Row>
      <CardActions class="pt-0 pb-0">
        <Button icon class="grey-text" on:click={handleOpenFolder}>
          <Icon path={mdiFolderOpen} size={"20px"} />
        </Button>
        <Button icon class="grey-text" on:click={handleOpenLink}>
          <Icon path={mdiLink} size={"20px"} />
        </Button>
        <Button icon class="grey-text" on:click={handleOpenState}>
          <Icon path={mdiWeatherSunny} size={"20px"}/>
        </Button>
      </CardActions>
    </Col>
    <Col cols={2} class="d-flex justify-center align-center">
      <Button  class="red-text font-weight-bold" text>
        <Icon path={mdiMinus} />
      </Button>
      <Button  class="blue-text font-weight-bold" text>
        <Icon path={mdiPlus} />
      </Button>
    </Col>
  </Row>
</Card>

<style>
  img {
    width: inherit;
  }
  :global(.title-card) {
    line-height: 1.2 !important;
  }
  .ver-img-card {
    background-size: cover;
    width: 100px;
    height: 100%;
    background-repeat: no-repeat;
    background-position: center;
    border-radius: 3px 0 0 3px;
  }
</style>