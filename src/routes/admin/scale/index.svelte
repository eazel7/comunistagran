<script context="module">
  export async function preload(page, session) {
    return {
      scale: await (await this.fetch(`/api/admin/scales`, {
        headers: { Authorization: session.ACCESS_TOKEN }
      })).json()
    };
  }
</script>

<script>
  import AdminNav from "../../../components/AdminNav.svelte";

  export let scale;
</script>

<svelte:head>
  <title>Escalafones</title>
</svelte:head>
<div class="mb-5 app">
  <div>
    <div>
      <div class="container mt-10">

        <AdminNav activeLink={'scale'} />

        <table class="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Nombre</th>
              <th scope="col">Usuarios</th>
              <th scope="col" />
            </tr>
          </thead>
          <tbody>
            {#each scale as scaleStep}
              <tr>
                <th scope="row">{scale.indexOf(scaleStep) + 1}</th>
                <td>{scaleStep.name}</td>
                <td>{Math.round(Math.random() * 1000)}</td>
                <td>
                  <div class="dropdown">
                    <button
                      class="btn btn-secondary dropdown-toggle"
                      type="button"
                      id="dropdownMenuButton"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false">
                      Acciones
                    </button>
                    <div
                      class="dropdown-menu"
                      aria-labelledby="dropdownMenuButton">
                      <div class="dropdown-item" href="#">Suspender la cuenta</div>
                      <div class="dropdown-item" href="#">Enviar mensaje</div>
                    </div>
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
