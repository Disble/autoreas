<script>
  import { mdiAccount, mdiAccountGroup, mdiHome, mdiHomeCity } from "@mdi/js";
  import {
    NavigationDrawer,
    List,
    ListItem,
    Avatar,
    Divider,
    Icon,
  } from "svelte-materialify/src";
  import Button from "svelte-materialify/src/components/Button";
  // Import the router component
  // Normally, this would be: `import Router from 'svelte-spa-router'`
  import Router from "svelte-spa-router";
  // Import the list of routes
  import routes from "./routes";

  let mini = true;
  function mouseenter() {
    mini = false;
  }
  function mouseleave() {
    mini = true;
  }
  const handleHome = () => {
    console.log("handleHome");
  };
  const handleRoute = () => {
    document.getElementById("sidebar").click();
  }
  setTimeout(() => {
    document.getElementById("sidebar").click();
  }, 5000)
</script>

<!-- <div
  class="d-inline-block"
  on:mouseenter={mouseenter}
  on:mouseleave={mouseleave}
>
  <NavigationDrawer {mini}>
    <ListItem on:click={handleHome}>
      <span slot="prepend" class="ml-n2">
        <Avatar size={40}>
          <Icon path={mdiHome} />
        </Avatar>
      </span>
      Mudit Somani
    </ListItem>
    <Divider />
    <List dense nav>
      <ListItem>
        <span slot="prepend">
          <Icon path={mdiHomeCity} />
        </span>
        <a href="#/">Home</a>
      </ListItem>
      <ListItem>
        <span slot="prepend">
          <Icon path={mdiAccount} />
        </span>
        <a href="#/hello/svelte">Say hi!</a>
      </ListItem>
      <ListItem>
        <span slot="prepend">
          <Icon path={mdiAccountGroup} />
        </span>
        Users
      </ListItem>
    </List>
  </NavigationDrawer>
</div> -->

<h1>svelte-spa-router sample</h1>
<h2>Basic routing</h2>

<!-- Navigation links -->
<ul>
  <li><a href="#/">Home</a></li>
  <li><a href="#/hello/svelte">Say hi!</a></li>
  <li><a href="#/wild/card">Wildcard route</a></li>
  <li><a href="#/does/not/exist">Not found</a></li>
  <li><a href="#/side" id="sidebar" >sidebarComponent</a></li>
</ul>

<!-- Show the router -->
<Router {routes} />
