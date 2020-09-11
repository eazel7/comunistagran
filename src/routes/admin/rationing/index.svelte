<script context="module">
  export async function preload(page, session) {
    return {
      schedules: await (await this.fetch(`/api/admin/rationing`, {
        headers: { Authorization: session.ACCESS_TOKEN }
      })).json()
    };
  }
</script>

<script>
  import AdminNav from "../../../components/AdminNav.svelte";
  export let schedules;
</script>

<svelte:head>
  <title>Racionamiento</title>
</svelte:head>
<div class="mb-5 app">
  <div>
    <div>
      <div class="container mt-10">

        <AdminNav activeLink={'rationing'} />


        <table class="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Nombre</th>
              <th scope="col">Desde</th>
              <th scope="col">Hasta</th>
              <th scope="col" />
            </tr>
          </thead>
          <tbody>
            {#each schedules as schedule}
              <tr>
                <th scope="row">{schedules.indexOf(schedule) + 1}</th>
                <td>{schedule.name || ''}</td>
                <td>{schedule.from}</td>
                <td>{schedule.to}</td>
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
