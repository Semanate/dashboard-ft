<script lang="ts">
  export let data;

  import Sidebar from "$lib/components/organisms/sidebar/Sidebar.svelte";
</script>

<main class="min-h-screen grid place-items-center bg-primary/30 p-6">
  <aside class="fixed top-0 left-0 h-full">
    <Sidebar
      user={data.user}
      variant="light"
      menu={[
        { label: "Inicio", icon: "House", href: "/dashboard" },
        { label: "Perfil", icon: "User", href: "/profile" },
        { label: "Configuración", icon: "Settings", href: "/settings" },
      ]}
      collapsed={false}
    />
  </aside>

  <section class="ml-64 p-6 w-full max-w-7xl">
    <h1 class="text-2xl font-bold mb-4">Panel de Control</h1>
    <p>Bienvenido a tu panel de control.</p>
  </section>
</main>
