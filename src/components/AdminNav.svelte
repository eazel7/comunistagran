<script>
export let activeLink;

import {onMount} from "svelte";

onMount(() => {
    // debugger;
})

</script>


<ul class="nav nav-tabs">
  <li class="nav-item" >
    <a class="nav-link"  class:active={activeLink == 'users'} href="/admin/users">Usuarios</a>
  </li>
  <li class="nav-item" >
    <a class="nav-link"  class:active={activeLink == 'behaviour'} href="/admin/behaviour">Comportamiento</a>
  </li>
  <li class="nav-item" >
    <a class="nav-link"  class:active={activeLink == 'rationing'} href="/admin/rationing">Racionamiento</a>
  </li>
  <li class="nav-item" >
    <a class="nav-link"  class:active={activeLink == 'scale'} href="/admin/scale">Escalafones</a>
  </li>
  <li class="nav-item" >
    <a class="nav-link"  class:active={activeLink == 'cyberpatrol'} href="/admin/cyberpatrol">Ciberpatrullaje</a>
  </li>
  <li class="nav-item" >
    <a class="nav-link"  class:active={activeLink == 'popular-statistics'} href="/admin/popular-statistics">Estadísticas populares</a>
  </li>
</ul>
