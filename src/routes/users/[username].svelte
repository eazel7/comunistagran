<script context="module">
  import decodeSessionToken from "../../decodeSessionToken";

  export async function preload(page, session) {
    try {
      const { username } = page.params;

      const makeHeaders = () => {
        return {
          authorization: session.ACCESS_TOKEN
        };
      };

      return {
        selfUsername: decodeSessionToken(session.ACCESS_TOKEN).username,
        userProfile: await (await this.fetch(`/api/userprofile/${username}`, {
          headers: makeHeaders()
        })).json(),
        posts: await (await this.fetch(`/api/userprofile/${username}/posts`, {
          headers: makeHeaders()
        })).json(),
        followers: await (await this.fetch(
          `/api/userprofile/${username}/followers`,
          {
            headers: makeHeaders()
          }
        )).json(),
        following: await (await this.fetch(
          `/api/userprofile/${username}/following`,
          {
            headers: makeHeaders()
          }
        )).json()
      };
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
</script>

<script>
  import { beforeUpdate, onMount } from "svelte";
  import checkAuthorization from "../check-authorization";
  import { writable } from "svelte/store";
  import { base64decode } from "../../utils"

  export let userProfile;
  export let posts;
  export let following;
  export let followers;
  export let selfUsername;

  onMount(() => {
    checkAuthorization();
    const token = JSON.parse(
      base64decode(window.sessionStorage["ACCESS_TOKEN"].split(".")[1])
    );

    selfUsername = token.username;
  });

  beforeUpdate(() => {});

  let stopFollowing = () => {
    fetch(
      `/api/userprofile/${selfUsername}/following/${userProfile.username}`,
      { method: "DELETE" }
    ).then(res => {
      if (res.status === 200) userProfile.following = false;
    });
  };

  let startFollowing = () => {
    fetch(
      `/api/userprofile/${selfUsername}/following/${userProfile.username}`,
      { method: "POST" }
    ).then(res => {
      if (res.status === 200) userProfile.following = true;
    });
  };
</script>

<svelte:head>
  <title>Perfil de {userProfile.username}</title>
</svelte:head>

<div class="mb-5 app" style="margin-top: 100px;">
  <div>
    <div>
      <div class="container component">
        <div>
          <div class="justify-content-center">
            <div class="card">
              <div class="col-sm-12 col-md-4 d-flex justify-content-center mt-4">
                <img
                  src={'/api/images/' + userProfile.profilePictureId}
                  alt=""
                  class="mr-5 rounded-circle mx-auto mb-3"
                  width="150"
                  height="150" />
              </div>
              <div class="col-sm-12 col-md-8">
                {#if userProfile.name}
                  <span class="lead username">
                    {userProfile.name} ({userProfile.username})
                  </span>
                {:else}
                  <span class="lead username">{userProfile.username}</span>
                {/if}
                {#if userProfile.self}
                  <a
                    class="ml-2 btn btn-sm btn-outline-dark"
                    href={'/accounts/' + userProfile.username + '/edit'}>
                    <span class="ml-3 mr-3">Modificar perfil</span>
                  </a>
                {:else if userProfile.following}
                  <a
                    class="ml-2 btn btn-sm btn-outline-dark"
                    on:click|preventDefault={stopFollowing}
                    href="javascript:">
                    <span class="ml-3 mr-3">Dejar de seguir</span>
                  </a>
                {:else}
                  <a
                    on:click|preventDefault={startFollowing}
                    class="ml-2 btn btn-sm btn-outline-dark"
                    href="javascript:">
                    <span class="ml-3 mr-3">Seguir</span>
                  </a>
                {/if}
                <div class="d-flex mt-3">
                  <div class="mr-4">
                    <span class="headerLinks" />
                    {posts.length} publicaciones
                  </div>
                  <div class="mr-4">{followers.length} seguidores</div>
                  <div class="mr-4">{following.length} suguiendo</div>
                </div>
                <p class="mt-3">{userProfile.bio}</p>
              </div>
            </div>
          </div>
          <hr />
        </div>
      </div>
      <div class="container">
        <div class="card">
          {#each posts as post}
            <div class="col-6 col-sm-6 col-md-4">
              <a href={'/posts/' + post.postId}>
                <div class="card border-0 rounded-0 mt-4 mb-2">
                  <img
                    src={'/api/images/' + post.imageId}
                    alt={post.caption}
                    class="card-img-top rounded-0" />
                  <div
                    class="card-img-overlay text-white d-flex
                    justify-content-center align-items-center invisible">
                    <div class="mr-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="white"
                        stroke="white"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="feedIcons">
                        <path
                          d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12
                          5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12
                          21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                      0
                    </div>
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="white"
                        stroke="white"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="feedIcons msgCircle">
                        <path
                          d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6
                          4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0
                          1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1
                          3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                      </svg>
                      0
                    </div>
                  </div>
                </div>
              </a>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </div>
</div>
