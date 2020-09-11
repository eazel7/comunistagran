<script context="module">
  export async function preload(page, session) {
    return {
      users: await (await this.fetch(`/api/admin/users`, {
        headers: { Authorization: session.ACCESS_TOKEN }
      })).json()
    };
  }
</script>

<script>
  import AdminNav from "../../../components/AdminNav.svelte";

  export let users;
</script>

<style>
.dropdown-item {
  cursor: pointer;
  
}</style>
<svelte:head>
  <title>Usuarios</title>
</svelte:head>
<div class="mb-5 app">
  <div>
    <div>
      <div class="container mt-10">

        <AdminNav activeLink={'users'} />
        <table class="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Bio</th>
              <th scope="col">Nombre</th>
              <th scope="col">Usuario</th>
              <th scope="col" />
            </tr>
          </thead>
          <tbody>
            {#each users as user}
              <tr>
                <th scope="row">{users.indexOf(user) + 1}</th>
                <td>{user.bio || ''}</td>
                <td>{user.name || ''}</td>
                <td>{user.username}</td>
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
