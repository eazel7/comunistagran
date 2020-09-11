<script context="module">
  export async function preload(page, session) {
    const { username } = page.params;

    return {
      posts: await (await this.fetch(`/api/posts/following`, {
        headers: {
          Authorization:
            session.ACCESS_TOKEN || window.sessionStorage["ACCESS_TOKEN"]
        }
      })).json()
    };
  }
</script>

<script>
  import { onMount } from "svelte";
  import checkAuthorization from "../check-authorization";
  import PostCard from "../../components/PostCard.svelte";

  export let posts = [];
  onMount(() => {
    checkAuthorization();
  });
</script>

<svelte:head>
  <title>Publicaciones de personas que sigues</title>
</svelte:head>

<div class="mb-5 app">
  <div>
    <div>
      <div class="container mt-10">
        <div class="card">
          <div class="card-body">
            {#if !posts.length}
              <div class="text-center component">
                <h4>Aún no sigues a nadie.</h4>
                <p class="lead">
                  Prueba la página
                  <a class="instaLinks text-primary" href="/explore">
                    Explorar
                  </a>
                  para buscar usuarios que quieras seguir.
                </p>
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
  </div>
</div>
