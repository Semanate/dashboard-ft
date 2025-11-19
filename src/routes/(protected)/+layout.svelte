<script lang="ts">
  import "$lib/styles/app.css";
  import Sidebar from "$lib/components/organisms/sidebar/Sidebar.svelte";
  export let data;
  export let children;
</script>

<main class="min-h-screen flex">
  <aside class="h-screen left-0 top-0">
    <Sidebar
      user={data.user}
      variant="light"
      menu={[
        { label: "Inicio", icon: "House", href: "/dashboard" },
        { label: "Perfil", icon: "User", href: "/profile" },
        { label: "Configuración", icon: "Settings", href: "/settings" },
      ]}
    />
  </aside>

  <article class="p-6 w-full">
    {@render children()}
  </article>
</main>
