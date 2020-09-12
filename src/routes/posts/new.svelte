<script>
  import Dropzone from "../../components/Dropzone.svelte";
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import checkAuthorization from "../check-authorization";
  import { goto } from "@sapper/app";
  import PlusIcon from "../../components/PlusIcon.svelte"

  let caption = "";
  let postPicture;
  let postPictureStore = writable();
  let error;
  let errorStore = writable();

  onMount(() => {
    checkAuthorization();
  });

  const postPictureUploaded = function(event, result) {
    postPictureStore.update(v => result);
  };

  $: postPictureStore.subscribe(v => (postPicture = v));
  let triggerSelection;

  let submitForm = () => {
    if (!postPicture || !postPicture.imageId) {
      errorStore.update(v => "No has subido la imagen a publicar");
      return;
    }
    if ((!caption || /^\s*$/.test(caption))) {
      errorStore.update(v => "Has dejado el epígrafe en blanco");
      return;
    }

    fetch("/api/posts", {
      method: "POST",
      headers: {
        authorization: window.sessionStorage["ACCESS_TOKEN"],
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        caption: caption,
        imageId: postPicture.imageId
      })
    })
      .then(result => {
        if (result.status != 200) {
          errorStore.update(v => result.statusText);
        } else {
          return result.json();
        }
      })
      .then(postId => {
        goto(`/posts/${postId}`);
      });
  };
</script>


<svelte:head>
  <title>Subir una nueva publicación</title>
</svelte:head>

<div class="mb-5 app" style="margin-top: 100px">
  <div>
    <div class="container d-flex justify-content-center component">
      <div class="card p-2 postCard rounded-0 undefined">
        <div class="card-body">
          <h1 class="text-center">Nueva publicación</h1>
          <form class="mt-4" on:submit|preventDefault={submitForm}>
            <Dropzone
              bind:triggerSelection
              dropzoneClass="dropzoneClass"
              hooveringClass="hooveringClass"
              id="postPictureDropZone"
              dropzoneEvents={{ success: postPictureUploaded }}
              options={{ url: '/api/upload-post-picture', clickable: true, acceptedFiles: 'video/mp4, image/jpeg, image/jpg, image/png', maxFilesize: 256 }}>
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
                Selecciona una imagen para publicar
              </p>
            </Dropzone>

            {#if postPicture && postPicture.imageUrl}
              <img alt="" style="max-width: 100%" src={postPicture.imageUrl} />
            {/if}
            <textarea
              class="form-control form-control-sm mt-1 inputBg"
              name="caption"
              bind:value={caption}
              placeholder="Dale un título..."
              type="text" />
            <button class="btn btn-primary btn-sm btn-block mt-3" disabled="">
              Publicar
            </button>
          </form>
          <div class="text-center mt-3">
            {#if $errorStore}
              <small class="error">{$errorStore}</small>
            {/if}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
