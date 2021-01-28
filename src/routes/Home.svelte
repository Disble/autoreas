<script>
import { List, ListItem, Row, Col } from 'svelte-materialify/src';
import Icon from 'svelte-materialify/src/components/Icon';
import ListGroup from 'svelte-materialify/src/components/List/ListGroup.svelte';
import { mdiChevronUp } from "@mdi/js";
import CardAnime from '../components/CardAnime.svelte';

const animes = [
  {
    nombre: 'Mushoku Tensei: Isekai Ittara Honki Dasu',
    nrocapvisto: 2,
    totalcap: 11,
    estado: 1,
    carpeta: 'localhost',
    pagina: 'online',
    _id: '_ndsano'
  },
  {
    nombre: 'ReZero kara Hajimeru Isekai Seikatsu 2nd Season',
    nrocapvisto: 15,
    totalcap: null,
    estado: 1,
    carpeta: 'localhost',
    pagina: 'online',
    _id: '_n1jzxcno'
  },
  {
    nombre: 'Yuru Camp△ Season 2',
    nrocapvisto: 2,
    totalcap: 2,
    estado: 1,
    carpeta: 'localhost',
    pagina: 'online',
    _id: '_qwe3ono'
  },
  {
    nombre: 'Honzuki no Gekokujou: Shisho ni Naru Tame ni wa Shudan wo Erandeiraremasen 2',
    nrocapvisto: 14,
    totalcap: 12,
    estado: 1,
    carpeta: 'localhost',
    pagina: 'online',
    _id: '_asd3ono'
  },
]
  let active = false;
  let active2 = false;
</script>

<div class="container">
  <Row class="align-start" noGutters style="height:150px">
    <Col style="max-width: 200px;">
      <div class="d-flex justify-center">
        <List class="elevation-2" style="width:300px">
          <ListGroup bind:active offset={72}>
            <span slot="prepend">
              <Icon class="mdi mdi-cog" />
            </span>
            <span slot="activator"> Día </span>
            <span slot="append">
              <Icon path={mdiChevronUp} rotate={active ? 0 : 180} />
            </span>
            <ListItem>Lunes</ListItem>
            <ListItem>Martes</ListItem>
            <ListItem>Miércoles</ListItem>
            <ListItem>Jueves</ListItem>
            <ListItem>Viernes</ListItem>
            <ListItem>Sábado</ListItem>
            <ListItem>Domingo</ListItem>
          </ListGroup>
          <ListGroup bind:active2 offset={72}>
            <span slot="prepend">
              <Icon class="mdi mdi-cog" />
            </span>
            <span slot="activator"> Estrenos </span>
            <span slot="append">
              <Icon path={mdiChevronUp} rotate={active2 ? 0 : 180} />
            </span>
            <ListItem>Sin ver</ListItem>
            <ListItem>Visto</ListItem>
            <ListItem>Ver hoy</ListItem>
          </ListGroup>
        </List>
      </div>
    </Col>
    <Col>
      <h1 class="text-h3 text-center">Domingo</h1>
      {#each animes as anime}
      <div class="d-flex justify-center mt-4 mb-4 cover-full">
        <div class="rounded elevation-2" style="flex-grow:1;max-width:65vw;">
          <CardAnime {anime} />
        </div>
      </div>
      {/each}
    </Col>
  </Row>
</div>