<script lang="ts">
  import "$lib/styles/app.css";
  import type { User } from "@supabase/supabase-js";
  import Sidebar from "$lib/components/organisms/sidebar/Sidebar.svelte";
  import { page } from "$app/state";
  import {
    createDynamicPermissionChecker,
    type DynamicPermissionChecker,
  } from "$lib/utils/permissions";
  import { ROLES, type Role } from "$lib/types/roles";
  import NotificationCenter from "$lib/components/molecules/notification/NotificationCenter.svelte";
  import NotificationBell from "$lib/components/molecules/notification/NotificationBell.svelte";
  import { notificationService } from "$lib/services/notification.service";
  import { onMount } from "svelte";
  import { supabase, initSupabase } from "$lib/db/client";

  interface Props {
    data: {
      user: User & { role: Role };
      userPermissions: string[];
      supabaseUrl: string;
      supabaseAnonKey: string;
      accessToken: string;
      refreshToken: string | null;
    };
    children: any;
  }
  const { data, children }: Props = $props();

  let permissions = $derived<DynamicPermissionChecker>(
    createDynamicPermissionChecker(
      data.user?.role ?? ROLES.USER,
      data.userPermissions ?? [],
    ),
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

  onMount(() => {
    const init = async () => {
      if (data.user?.id && data.supabaseUrl && data.supabaseAnonKey) {
        initSupabase(data.supabaseUrl, data.supabaseAnonKey);

        if (data.accessToken) {
          const { data: sessionData, error: sessionError } =
            await supabase.auth.setSession({
              access_token: data.accessToken,
              refresh_token: data.refreshToken || "",
            });

          if (sessionError) {
            console.error("❌ Error setting session:", sessionError);
          } else {
            console.log("✅ Session set successfully:", sessionData);

            // Verify session is active
            const {
              data: { session },
            } = await supabase.auth.getSession();
            console.log("📋 Current session:", session);
            console.log("📋 Auth UID:", session?.user?.id);
          }
        } else {
          console.warn("⚠️ No access token provided!");
        }

        // 3. Start Notification Service
        console.log("🔔 Initializing notification service...");
        await notificationService.init(supabase, data.user.id);
      }
    };

    init();

    return () => notificationService.stop();
  });
</script>

<main class="min-h-screen flex max-h-screen">
  <NotificationCenter />
  <aside class="h-screen left-0 top-0 z-20">
    <Sidebar user={data.user} variant="light" {menu} collapsed />
  </aside>

  <article
    class="flex-1 flex flex-col max-h-screen overflow-hidden bg-gray-50/50"
  >
    <header
      class="h-16 px-6 border-b bg-white flex items-center justify-end shrink-0 gap-4"
    >
      <!-- Future Header Content -->
      <div class="flex items-center gap-2">
        <span class="text-xs text-gray-500 font-medium">Notificaciones</span>
        <NotificationBell />
      </div>
    </header>
    <div class="flex-1 overflow-y-auto p-4">
      {@render children()}
    </div>
  </article>
</main>
