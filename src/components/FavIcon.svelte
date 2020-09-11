<script>
import SovietStarFilled from "./SovietStarFilled.svelte";
import SovietStarEmpty from "./SovietStarEmpty.svelte";
import RedHeart from "./RedHeart.svelte";
import EmptyHeart from "./EmptyHeart.svelte";
  export let postStore;
  let post;
  postStore.subscribe(v => (post = v));
  import decodeSessionToken from "../decodeSessionToken"

  export let switchFav = () => {
    if (post.faved) {
      fetch(`/api/posts/${post.postId}/fav`, {
        method: "DELETE",
        headers: { authorization: window.sessionStorage["ACCESS_TOKEN"] }
      }).then(() => {
        post.faved = false;
        post.favedBy.splice(post.favedBy.indexOf(decodeSessionToken(window.sessionStorage["ACCESS_TOKEN"]).username), 1);
        postStore.update(v => post);
      });
    } else {
      fetch(`/api/posts/${post.postId}/fav`, {
        method: "POST",
        headers: { authorization: window.sessionStorage["ACCESS_TOKEN"] }
      }).then(() => {
        post.faved = true;
        post.favedBy.push(decodeSessionToken(window.sessionStorage["ACCESS_TOKEN"]).username)
        postStore.update(v => post);
      });
    }
  };
</script>

{#if post.faved}
  <SovietStarFilled on:click={switchFav} />
{:else}
  <SovietStarEmpty on:click={switchFav} />
{/if}
