<script lang="ts">
  import "$lib/styles/app.css";
  import Sidebar from "$lib/components/organisms/sidebar/Sidebar.svelte";
  import { page } from "$app/state";

  export let data;
  export let children;
</script>

<main class="min-h-screen flex">
  <aside class="h-screen left-0 top-0">
    <Sidebar
      user={data.user}
      variant="light"
      menu={[
        {
          label: "Inicio",
          icon: "House",
          href: "/dashboard",
          active: page.url.pathname === "/dashboard",
        },
        {
          label: "Perfil",
          icon: "User",
          href: "/profile",
          active: page.url.pathname === "/profile",
        },
        {
          label: "Configuración",
          icon: "Settings",
          href: "/admin/settings",
          active: page.url.pathname === "/admin/settings",
        },
      ]}
    />
  </aside>

  <article class="p-6 w-full">
    {@render children()}
  </article>
</main>
