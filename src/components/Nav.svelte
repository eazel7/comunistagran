<script>
  import Logo from "../components/Logo.svelte";
  import LogoIcon from "../components/LogoIcon.svelte";
  import { onMount } from "svelte";
  import { goto } from "@sapper/app";
  import { stores } from "@sapper/app";
  const { preloading, page, session } = stores();
  import { isLoggedIn } from "../loginStore.js";
  import { base64decode } from "../utils.js";

  let loggedIn;
  let username;

  onMount(() => {
    isLoggedIn.subscribe(v => {
      loggedIn = v;

      if (v) {
        try {
          let payload = v.split(".")[1];

          let decoded = JSON.parse(base64decode(payload));

          username = decoded.username;
        } catch (e) {
          console.error(e);
        }
      }
    });
    page.subscribe(pageInfo => {
      if (pageInfo.path === "/login" || pageInfo.path === "/register" || pageInfo.path === "/unauthorized") return;

      if (
        !window.sessionStorage["ACCESS_TOKEN"] &&
        (pageInfo.path !== "/login" || pageInfo.path !== "/register" || pageInfo.path === "/unauthorized")
      ) {
        goto("/login");
        return;
      }

      isLoggedIn.update(v => window.sessionStorage["ACCESS_TOKEN"]);
    });
  });

  let logout = () => {
    delete window.sessionStorage["ACCESS_TOKEN"];
    isLoggedIn.update(v => false);

    goto("/login");
  };
</script>

{#if loggedIn}
  <nav
    class="navbar navbar-expand navbar-light bg-white border-bottom fixed-top">
    <div class="container d-flex justify-content-start">
      <a href="/posts">
        <LogoIcon />
      </a>
      <div class="ml-3 mr-3 verticalLine d-none d-sm-block" />
      <a class="navbar-brand d-none d-sm-block" href="/posts">
        <img src="/logo.png" alt="" width="120" />
      </a>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ml-auto">
          <li class="nav-item active">
            <a class="nav-link" href="/posts/new">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="navIcons">
                <path
                  d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1
                  2-2h5.34" />
                <polygon points="18 2 22 6 12 16 8 16 8 12 18 2" />
              </svg>
            </a>
          </li>
          <li class="nav-item active ml-3 mr-3">
            <a class="nav-link" href="/explore">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="navIcons">
                <circle cx="12" cy="12" r="10" />
                <polygon
                  points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
              </svg>
            </a>
          </li>
          <li class="nav-item active mr-3">
            <a class="nav-link" href={'/users/' + username}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="navIcons">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </a>
          </li>
          <li class="nav-item active" on:click={logout}>
            <div class="nav-link" style="cursor: pointer">
              <svg
                style="cursor: pointer"
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="navIcons">
                <path
                  style="cursor: pointer"
                  d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline style="cursor: pointer" points="16 17 21 12 16 7" />
                <line style="cursor: pointer" x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </nav>
{:else}
  <nav
    class="navbar navbar-expand navbar-light bg-white border-bottom fixed-top">
    <div class="container d-flex justify-content-start">
      <a href="/">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="25"
          height="25"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="logo">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.5" y2="6.5" />
        </svg>
      </a>
      <div class="ml-3 mr-3 verticalLine d-none d-sm-block" />
      <a class="navbar-brand d-none d-sm-block" href="/">
        <img src="/logo.png" alt="" width="120" />
      </a>
    </div>
  </nav>
{/if}
