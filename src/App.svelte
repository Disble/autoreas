<script>
  // Normally, this would be: `import Router from 'svelte-spa-router'`
  import Router, {push} from "svelte-spa-router";
  // Import the list of routes
  import { MaterialApp } from 'svelte-materialify';
  const { ipcRenderer } = require('electron');
  import routes from "./routes";

  let theme = 'light';

  const toggleTheme = () => {
    if (theme === 'light') theme = 'dark';
    else theme = 'light';
  }

  ipcRenderer.on('router', (e, route) => {
    // The push(url) method navigates to another page, just like clicking on a link
    push(route)
  });
  ipcRenderer.on('dark-mode', () => {
    toggleTheme();
  });
</script>

<MaterialApp class="MaterialApp" {theme}>
  <Router {routes} />
</MaterialApp>

<style type="scss" global>
  body {
    padding: 0;
  }
</style>