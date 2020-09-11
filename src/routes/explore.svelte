<script context="module">
  export async function preload(page, session) {
    const { username } = page.params;

    return {
      posts: await (await this.fetch(`/api/posts/explore`, {
        headers: { Authorization: session.ACCESS_TOKEN || window.sessionStorage["ACCESS_TOKEN"] }
      })).json()
    };
  }
</script>

<script>
  import { onMount } from "svelte";
  import checkAuthorization from "./check-authorization";
  import PostCard from "../components/PostCard.svelte";

  export let posts = [];
  onMount(() => {
    checkAuthorization();
  });
</script>

<svelte:head>
  <title>Explorando</title>
</svelte:head>

<div class="mb-5 app">
  <div>
    <div>
      <div class="container mt-10">

        {#if !posts.length}
          <div class="text-center component">
            <h4>No hay nada que ver aquí.</h4>
          </div>
        {:else}
          <div class="row">
            {#each posts as post}
              <PostCard {post} />
            {/each}
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>
