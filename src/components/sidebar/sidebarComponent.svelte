<script>
import { Button } from 'svelte-materialify';
import Alert from 'svelte-materialify/src/components/Alert';
import Icon from 'svelte-materialify/src/components/Icon';
</script>



<div>
  <div class="d-flex flex-column flex-sm-row justify-space-between">
    <Button depressed>Default</Button>
    <Button depressed class="red white-text">Red</Button>
    <Button depressed class="primary-color">Primary</Button>
    <Button depressed disabled>Disabled</Button>
  </div>
  <Alert class="primary-color">
    <div slot="icon">
      <Icon class="mdi mdi-thumb-up" />
    </div>
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto, aperiam ad iure
    harum iste ea numquam quo accusamus blanditiis in.
  </Alert>
  <p>Olip</p>
</div>