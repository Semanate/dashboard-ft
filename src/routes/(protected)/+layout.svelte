<script lang="ts">
  import "$lib/styles/app.css";
  import type { User } from "@supabase/supabase-js";
  import Sidebar from "$lib/components/organisms/sidebar/Sidebar.svelte";
  import { page } from "$app/state";
  import { createDynamicPermissionChecker, type DynamicPermissionChecker } from "$lib/utils/permissions";
  import { ROLES, type Role } from "$lib/types/roles";

  interface Props {
    data: {
      user: User & { role: Role };
      userPermissions: string[];
    };
    children: any;
  }
  const { data, children }: Props = $props();

  // Crear el checker de permisos dinámico basado en los permisos de la DB
  let permissions = $derived<DynamicPermissionChecker>(
    createDynamicPermissionChecker(
      data.user?.role ?? ROLES.USER,
      data.userPermissions ?? []
    )
  );

  let menu = $derived([
    {
      label: "Inicio",
      icon: "House",
      href: "/dashboard",
      active: page.url.pathname === "/dashboard",
      disabled: !permissions.canViewDashboard,
    },
    {
      label: "SARLAFT",
      icon: "Shield",
      href: "/sarlaft",
      active: page.url.pathname.startsWith("/sarlaft"),
      disabled: !permissions.canViewSarlaft,
    },
    {
      label: "Reportes",
      icon: "BarChart3",
      href: "/reports",
      active: page.url.pathname.startsWith("/reports"),
      disabled: !permissions.canViewReports,
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
      disabled: !permissions.canManageSettings,
    },
    {
      label: "Usuarios",
      icon: "Users",
      href: "/admin/users",
      active: page.url.pathname === "/admin/users",
      disabled: !permissions.canManageUsers,
    },
    {
      label: "Noticias",
      icon: "FileText",
      href: "/admin/news",
      active: page.url.pathname.startsWith("/admin/news"),
      disabled: !permissions.canManageNews,
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
