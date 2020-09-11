<script>
  import { onMount } from "svelte";
  export let dropzoneEvents = {};
  export let options = { previewTemplate: "<div/>" };
  export let dropzoneClass = "dropzone";
  export let hooveringClass = "dropzone-hoovering";
  export let id = "dropId";
  export let autoDiscover = false;
  let clickableElement;

  export const triggerSelection = () => {
    if (clickableElement) clickableElement.click();
  };

  let svDropzone;

  onMount(() => {
    const dropzoneElement = document.getElementById(id);
    if (!options.previewTemplate) {
      options.previewTemplate = "<div/>";
    }
    if (!options.dictDefaultMessage) {
      options.dictDefaultMessage = "";
    }

    options.headers = { authorization: window.sessionStorage["ACCESS_TOKEN"] };

    svDropzone = new Dropzone(`div#${id}`, {
      ...options
    });
    if (autoDiscover === true) {
      svDropzone.autoDiscover = true;
    }

    clickableElement = svDropzone.clickableElements[0];

    svDropzone.on("addedfile", f => {
      dropzoneElement.classList.remove(hooveringClass);
    });
    svDropzone.on("dragenter", e => {
      dropzoneElement.classList.toggle(hooveringClass);
    });
    svDropzone.on("dragleave", e => {
      dropzoneElement.classList.toggle(hooveringClass);
    });
    Object.entries(dropzoneEvents).map(([eventKey, eventFunc]) =>
      svDropzone.on(eventKey, eventFunc)
    );

    if (options.clickable !== false) {
      dropzoneElement.style.cursor = "pointer";
    }
    svDropzone.on("error", (file, errorMessage) => {});
  });
</script>

<style>
  .dropzone {
    height: 100px;
    min-height: 100px;
    background: #fdfdfd;
    border-radius: 5px;
    border: 1px dashed #ced4da;
    margin-top: 0.25rem !important;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 300ms ease-out;
  }

  .dropzone.dropzone-hoovering {
    border: 1px dashed #ced4da;
    background: rgba(255, 62, 0, 0.05);
  }
</style>

<div action="#" class={'dropzone ' + dropzoneClass} {id}>
  <slot />
  <input hidden name="sites_data" type="file" />
</div>
