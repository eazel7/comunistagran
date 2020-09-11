<script>
  import { onMount } from "svelte";
  import checkAuthorization from "./check-authorization";

  onMount(() => {
    checkAuthorization();
  });
</script>

<svelte:head>
  <title>Comunistagran</title>
</svelte:head>
<style>
.great-success {
    position: fixed;
    bottom: 0;
    left: 50%;
    right: 0;
    height: 50%;
    transform: translateX(-50%);
}

.logo {

    max-width: 100%;
}
</style>

<div class="mb-5 app">
  <div>
    <div>
      <div class="container mt-10 text-center">
        <img src="/logo.png" alt="logo" class="logo" />
        <img src="/great-success.png" alt="gran éxito" class="great-success" />
      </div>
    </div>
  </div>
</div>
