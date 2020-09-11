<script>
  import Nav from "../components/Nav.svelte";
  import { onMount } from "svelte";

  import { writable } from "svelte/store";
  import { stores } from "@sapper/app";
  const { preloading, page, session } = stores();
  import { isLoggedIn } from "../loginStore.js";

  let loggedIn;
  let okToDisplay;
  let path;

  let okToDisplayStore = writable(false);
  let pathStore = writable();

  $: okToDisplayStore.update(v => okToDisplay);
  $: pathStore.update(v => path);

  onMount(() => {
    isLoggedIn.subscribe(() => {
      okToDisplay =
        path === "/login" ||
        path === "/register" ||
        path === "/unauthorized" ||
        window.sessionStorage["ACCESS_TOKEN"];
    });
    page.subscribe(pageInfo => {
      path = pageInfo.path;
      okToDisplay =
        path === "/login" ||
        path === "/register" ||
        path === "/unauthorized" ||
        window.sessionStorage["ACCESS_TOKEN"];

      isLoggedIn.update(v => window.sessionStorage["ACCESS_TOKEN"]);
    });
  });
</script>

<div id="root">
  <div>
    <Nav />
    {#if okToDisplay}
      <div class="slot">
        <slot />
      </div>
    {/if}
  </div>
</div>
