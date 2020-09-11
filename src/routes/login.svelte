<script>
  import { writable } from "svelte/store";
  import { goto } from "@sapper/app";
  import { isLoggedIn } from "../loginStore.js";

  let username = "";
  let password = "";

  let loginDisabled = writable(false);
  let error = writable(null);
  let errorText = null;

  $: loginDisabled.update(v => !username || !password);
  $: error.update(v => errorText);

  export function handleSubmit() {
    fetch("/api/get_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username: username, password: password })
    })
      .then(response => (response.status === 200 ? response.json() : null))
      .then(json => {
        if (json) {
          window.sessionStorage["ACCESS_TOKEN"] = json;
          isLoggedIn.update(v => json);

          goto("/posts");
        } else {
          errorText = "Credenciales inválidas";
        }
      });
  }
</script>

<svelte:head>
  <title>Iniciar sesión</title>
</svelte:head>

<div class="mb-5 app" style="margin-top: 100px;">
  <div>
    <div class="container d-flex justify-content-center component">
      <div class="card p-5 infoCards rounded-0">
        <img src="/logo.png" alt="" class="mx-auto" width="150" />
        <form class="mt-4" on:submit|preventDefault={handleSubmit}>
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
          <button
            class="btn btn-primary btn-sm btn-block mt-3"
            disabled={$loginDisabled}>
            Iniciar sesión
          </button>
        </form>
        {#if errorText}
          <small class="error text-center mt-3">{errorText}</small>
        {/if}
      </div>
    </div>
    <div class="container d-flex justify-content-center mt-2">
      <div class="card text-center infoCards rounded-0">
        <div class="card-body">
          ¿Aún no tienes cuenta?
          <a href="/register">Regístrate</a>
        </div>
      </div>
    </div>
  </div>
</div>
