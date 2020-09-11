<script context="module">
  export async function preload(page, session) {
    const { username } = page.params;

    return {
      userProfile: await (await this.fetch(`/api/userprofile/${username}`, {
        headers: { Authorization: session.ACCESS_TOKEN || window.sessionStorage["ACCESS_TOKEN"] }
      })).json()
    };
  }
</script>

<script>
  import { onMount } from "svelte";
  import checkAuthorization from "../../check-authorization";
  import { goto } from "@sapper/app";

  export let userProfile;

  onMount(() => {
    checkAuthorization();
  });

  let submitForm = async () => {
    let res = await fetch(`/api/userprofile/${userProfile.username}`, {
      method: "PATCH",
      headers: {
        authorization: window.sessionStorage["ACCESS_TOKEN"],
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        bio: userProfile.bio,
        name: userProfile.name
      })
    });

    if (res.status === 200) {
      goto(`/users/${userProfile.username}`);
    }
  };
</script>


<svelte:head>
  <title>Modificar tu perfil</title>
</svelte:head>

<div class="mb-5 app" style="margin-top: 100px;">
  <div class="container d-flex justify-content-center component">
    <div class="card p-2 editProfileCard rounded-0">
      <div class="card-body">
        <form on:submit|preventDefault={submitForm}>
          <div class="row mb-3">
            <div class="col-4 col-md-4">
              <img
                src={"/api/images/" + userProfile.profilePictureId}
                class="mr-3 rounded-circle align-self-center"
                alt=""
                width="65"
                height="65" />
            </div>
            <div class="col-6 col-md-6">
              <h5>{userProfile.username}</h5>
              <!-- <div
                class="upload text-primary"
                aria-disabled="false"
                style="position: relative;">
              </div> -->
            </div>
          </div>
          <div class="form-group row">
            <label class="col-sm-4 col-form-label">Nombre</label>
            <div class="col-sm-8">
              <input
                bind:value={userProfile.name}
                name="name"
                class="form-control form-control-sm" />
            </div>
          </div>
          <div class="form-group row">
            <label class="col-sm-4 col-form-label">Usuario</label>
            <div class="col-sm-8">
              <input
                bind:value={userProfile.username}
                name="username"
                class="form-control form-control-sm"
                disabled />
            </div>
          </div>
          <div class="form-group row">
            <label class="col-sm-4 col-form-label">Bio</label>
            <div class="col-sm-8">
              <textarea
                name="bio"
                bind:value={userProfile.bio}
                class="form-control form-control-sm" />
            </div>
          </div>
          <button class="btn btn-primary btn-sm btn-block mt-3">Enviar</button>
        </form>
      </div>
    </div>
  </div>
</div>
