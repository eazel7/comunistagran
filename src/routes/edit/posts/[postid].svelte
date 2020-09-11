<div class="mb-5 app" style="margin-top: 100px;">
  <div class="container d-flex justify-content-center component">
    <div class="card p-2 postCard rounded-0">
      <div class="card-body">
        <h1 class="text-center">Modificar publicación</h1>
        <div class="text-center mt-4">
          <img
            class="imgPreview"
            alt=""
            width="100%"
            src="https://res.cloudinary.com/comuninstagram/image/upload/v1589579232/osszkubesetxdcejkqnj.jpg" />
        </div>
        <form class="mt-4">
          <div
            class="drop mt-1 rounded"
            aria-disabled="false"
            style="position: relative;">
            <div class="d-flex justify-content-center h-100">
              <div class="text-center align-self-center">
                <div>
                  <svg
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
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </div>
                <span class="text-muted avatarText">Subir imagen</span>
              </div>
            </div>
            <input
              accept="image/jpeg, image/jpg, image/png"
              type="file"
              multiple=""
              autocomplete="off"
              style="position: absolute; top: 0px; right: 0px; bottom: 0px;
              left: 0px; opacity: 1e-05; pointer-events: none;" />
          </div>
          <textarea
            name="caption"
            class="form-control form-control-sm mt-1 inputBg">
            porroncito
          </textarea>
          <button class="btn btn-primary btn-sm btn-block mt-3" disabled="">
            Publicar
          </button>
        </form>
      </div>
    </div>
  </div>
</div>
