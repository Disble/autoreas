<script>
  import { MaterialApp } from 'svelte-materialify';
	import { mdiCheck } from '@mdi/js';
	import Sidebar from './components/sidebar/sidebarComponent.svelte';
	import Alert from 'svelte-materialify/src/components/Alert';
	import Icon from 'svelte-materialify/src/components/Icon';
	let theme = 'light';
</script>

<MaterialApp theme="{theme}">
	<Sidebar  />
	<Alert class="yellow-text text-darken-4" text>
		<div slot="icon">
			<Icon path={mdiCheck} />
		</div>
		Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto, aperiam ad iure
		harum iste ea numquam quo accusamus blanditiis in.
	</Alert>
	<h1>Hola</h1>
</MaterialApp>
