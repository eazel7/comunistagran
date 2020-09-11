<script context="module">
  export async function preload(page, session) {
    const { postId } = page.params;

    return {
      post: await (await this.fetch(`/api/posts/${postId}`, {
        headers: {
          authorization:
            session.ACCESS_TOKEN || window.sessionStorage["ACCESS_TOKEN"]
        }
      })).json()
    };
  }
</script>

<script>
  import FavIcon from "../../components/FavIcon.svelte";
  import moment from "moment";
  import { writable } from "svelte/store";
  import { goto } from "@sapper/app";
  export let post;
  export const howLongAgo = post => moment(post.date).fromNow();
  import decodeSessionToken from "../../decodeSessionToken";
  let postStore = writable(post);
  postStore.subscribe(v => (post = v));

  let newCommentText = "";

  let postNewComment = () => {
    fetch(`/api/posts/${post.postId}/comments`, {
      method: "POST",
      headers: {
        Authorization: window.sessionStorage["ACCESS_TOKEN"],
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ comment: newCommentText })
    }).then(response => {
      if (response.status === 200) {
        post.comments.push({
          comment: newCommentText,
          username: decodeSessionToken(window.sessionStorage["ACCESS_TOKEN"])
            .username
        });
        postStore.update(v => post);
        newCommentText = "";
      }
    });
  };
</script>

<style>
  .comment-button {
    display: block;
    width: 100%;
    color: white;
    background: #bd2130;
    border: none;
    margin-top: 8px;
  }
</style>

<svelte:head>
  <title>{post.username} - {post.caption}</title>
</svelte:head>

<div class="mb-5 app" style="margin-top: 100px">
  <div>
    <div>
      <div class="container component">
        <div class="row no-gutters d-flex justify-content-center">
          <div class="col-12 col-sm-7 d-none d-sm-block">
            <div
              class="card d-flex justify-content-center rounded-0 border-right-0
              h-100">
              <img
                src={'/api/images/' + post.imageId}
                alt=""
                class="rounded-0 img-fluid align-self-center" />
            </div>
          </div>
          <div class="col-12 col-sm-4">
            <div class="card rounded-0 displayCard h-100">
              <div class="card-header bg-white p-3 d-block d-sm-none">
                <div>
                  <img
                    src={'/api/userprofile/' + post.username + '/profile-picture'}
                    alt=""
                    class="rounded-circle mr-2"
                    width="30px"
                    height="30px" />
                  <a class="feedLinks" href={'/users/' + post.username}>
                    {post.username}
                  </a>
                </div>
              </div>
              <img
                src={post.imageUrl}
                alt=""
                class="rounded-0 card-img-top d-block d-sm-none" />
              <div class="p-3 d-none d-sm-block">
                <div>
                  <img
                    src={'/api/userprofile/' + post.username + '/profile-picture'}
                    alt=""
                    class="rounded-circle mr-2"
                    width="30px"
                    height="30px" />
                  <a class="feedLinks" href={'/users/' + post.username}>
                    {post.username}
                  </a>
                </div>
                <hr />
                <div class="mt-1">
                  <a class="feedLinks" href={'/users/' + post.username}>
                    {post.username}
                  </a>
                  {post.caption}
                </div>
                <div class="commentSection">
                  {#each post.comments as comment}
                    <div>
                      <div>
                        <a
                          class="feedLinks"
                          href={'/users/' + comment.username}>
                          {comment.username}
                        </a>
                        {comment.comment}
                      </div>
                    </div>
                  {/each}
                </div>
              </div>
              <div class="p-3 mt-auto">
                <hr class="d-none d-sm-block" />
                <div>
                  <FavIcon {postStore} />
                </div>
                <div>{$postStore.favedBy.length} likes</div>
                {#each post.comments as comment}
                  <div class="d-block d-sm-none">
                    <div>
                      <div>
                        <a
                          class="feedLinks"
                          href={"/users/" + comment.username}>
                          {comment.username}
                        </a>
                        {comment.comment}
                      </div>
                    </div>
                  </div>
                {/each}
                <div>
                  <a
                    class="text-uppercase postDate"
                    href={'/posts/' + post.postId}>
                    {howLongAgo(post)}
                  </a>
                </div>
                <hr />
                <form on:submit|preventDefault={postNewComment}>
                  <input
                    name="comment"
                    class="form-control form-control-sm border-0"
                    type="text"
                    bind:value={newCommentText}
                    placeholder="Deja un comentario..."
                    autocomplete="off" />
                  <input
                    type="submit"
                    value="Comentar"
                    class="comment-button" />
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
