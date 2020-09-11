<script>
  export let post;

  import FavIcon from "./FavIcon.svelte";
  import CommentIcon from "./CommentIcon.svelte";
  import EditIcon from "./EditIcon.svelte";
  import { writable } from "svelte/store";
  import moment from "moment";
  import decodeSessionToken from "../decodeSessionToken"

  let postStore = writable(post);
  postStore.subscribe(v => (post = v));

  export const howLongAgo = post => moment(post.date).fromNow();

  let newCommentText = "";
  let newCommentTextStore = writable(newCommentText);
  newCommentTextStore.subscribe(v => newCommentText = v);
  let commentsStore = writable(post.comments);

  commentsStore.subscribe(v => (post.comments = v));

  let postComment = () => {
    fetch(`/api/posts/${post.postId}/comments`, {
      method: "POST",
      headers: {
        Authorization: window.sessionStorage["ACCESS_TOKEN"],
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ comment: newCommentText })
    }).then(response => {
      if (response.status === 200) {
        let self = decodeSessionToken(window.sessionStorage["ACCESS_TOKEN"]);
        post.comments.push({
          comment: newCommentText,
          username: self.username
        });
        commentsStore.update(v => post.comments);
        newCommentTextStore.update(v => "");
      }
    });
  };
</script>

<div class="col-12 d-flex justify-content-center">
  <div class="card feedCard mt-5">
    <div class="card-header bg-white p-3">
      <img
        src={"/api/userprofile/" + post.username + "/profile-picture"}
        alt=""
        class="rounded-circle mr-2"
        width="30px"
        height="30px" />
      <a class="feedLinks" href={'/users/' + post.username}>{post.username}</a>
    </div>
    <img src={"/api/images/" + post.imageId} alt="" class="card-img-top rounded-0" />
    <div class="pt-3 pr-3 pl-3">{post.caption}</div>
    <div class="pb-3 pr-3 pl-3">
      <div class="mt-2">
        <a class="text-uppercase" style="float: right" href={'/posts/' + post.postId}>
          {howLongAgo(post)}
        </a>
          <FavIcon postStore={postStore} />
        {$postStore.favedBy.length} likes
      </div>
      {#if post && post.comments}
        {#each post.comments as comment}
          <div class="mt-1">
            <a class="feedLinks" href={'/users/' + comment.username}>
              {comment.username}
            </a>
            {comment.comment}
          </div>
        {/each}
      <div />
      <hr />
      <form on:submit|preventDefault={postComment}>
        <input
          name="comment"
          class="form-control form-control-sm border-0"
          type="text"
          placeholder="Deja un comentario..."
          autocomplete="off"
          bind:value={newCommentText} />
      </form>
      {/if}
    </div>
  </div>
</div>
