<script lang="ts">
  import "$lib/styles/app.css";
  import type { User } from "@supabase/supabase-js";
  import Sidebar from "$lib/components/organisms/sidebar/Sidebar.svelte";
  import { page } from "$app/state";

  interface Props {
    data: {
      user: User;
    };
    children: any;
  }
  const { data, children }: Props = $props();

  let menu = $derived([
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
      disabled: data.user?.role !== "admin",
    },
    {
      label: "Usuarios",
      icon: "Users",
      href: "/admin/users",
      active: page.url.pathname === "/admin/users",
      disabled: data.user?.role !== "admin",
    },
  ]);
</script>

<main class="min-h-screen flex max-h-screen">
  <aside class="h-screen left-0 top-0">
    <Sidebar user={data.user} variant="light" {menu} collapsed />
  </aside>

  <article class="p-2 w-full max-h-screen overflow-y-auto">
    {@render children()}
  </article>
</main>
