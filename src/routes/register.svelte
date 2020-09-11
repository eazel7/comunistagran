<script>
  import Dropzone from "../components/Dropzone.svelte";
  import { writable } from "svelte/store";
  import { goto } from "@sapper/app";
  import { isLoggedIn } from "../loginStore.js";

  let username = "";
  let password = "";
  let profilePicture;
  let profilePictureStore = writable();
  let error;
  let errorStore = writable();

  let formSubmit = function(e) {
    fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: username,
        password: password,
        profilePictureId: profilePicture.imageId
      })
    })
      .then(response =>
        response.status === 200 ? response.json() : { err: response.statusText }
      )
      .then(response => {
        if (!response.err) {
          window.sessionStorage["ACCESS_TOKEN"] = response;
          isLoggedIn.update(v => true);

          goto("/posts");
        } else {
          errorStore.update(v => response.err);
        }
      });
  };

  const profilePictureUploaded = function(event, result) {
    profilePictureStore.update(v => result);
  };

  $: profilePictureStore.subscribe(v => (profilePicture = v));
  $: errorStore.subscribe(v => (error = v));

  let triggerSelection;
</script>

<svelte:head>
  <title>Regístrate</title>
</svelte:head>

<div class="mb-5 app" style="margin-top: 100px;">
  <div>
    <div class="container d-flex justify-content-center component">
      <div class="card p-5 infoCards rounded-0">
        <img src="/logo.png" alt="" class="mx-auto" width="150" />
        <form class="mt-4" on:submit|preventDefault={formSubmit}>
          {#if profilePicture && profilePicture.imageUrl}
            <img alt="" style="max-width: 100%" src={profilePicture.imageUrl} />
          {/if}
          <div>
            <input
              class="form-control form-control-sm mt-1 inputBg"
              name="username"
              bind:value={username}
              placeholder="Usuario"
              type="text" />
          </div>
          <div>
            <input
              class="form-control form-control-sm mt-1 inputBg"
              name="password"
              bind:value={password}
              placeholder="Contraseña"
              type="password" />
          </div>
          <div>
            <Dropzone
              bind:triggerSelection
              dropzoneClass="dropzoneClass"
              hooveringClass="hooveringClass"
              id="profilePictureDropZone"
              dropzoneEvents={{ success: profilePictureUploaded }}
              options={{ url: '/api/upload-profile-picture', clickable: true, acceptedFiles: 'image/jpeg, image/jpg, image/png', maxFilesize: 256 }}>
              <p
                on:click={triggerSelection}
                style="cursor: pointer; text-align: center">
                <svg
                  style="cursor: pointer !important;"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="text-muted camera">
                  <line
                    style="cursor: pointer !important;"
                    x1="12"
                    y1="5"
                    x2="12"
                    y2="19" />
                  <line
                    style="cursor: pointer !important;"
                    x1="5"
                    y1="12"
                    x2="19"
                    y2="12" />
                </svg>
                <br />
                Selecciona una foto de perfil
              </p>
            </Dropzone>

          </div>
          <button class="btn btn-primary btn-sm btn-block mt-3" disabled="">
            Registrarse
          </button>
        </form>
        <div class="text-center mt-3">
          {#if error}
            <small class="error">{error}</small>
          {/if}
        </div>
      </div>
    </div>
    <div class="container d-flex justify-content-center mt-2">
      <div class="card text-center infoCards rounded-0">
        <div class="card-body">
          ¿Ya tienes cuenta?
          <a href="/">Inicia sesión</a>
        </div>
      </div>
    </div>
  </div>
</div>
