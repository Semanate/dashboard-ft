<script lang="ts">
  import MenuItem from "$lib/components/molecules/menu-item/MenuItem.svelte";
  import UserInfo from "$lib/components/molecules/user-info/UserInfo.svelte";
  import ButtonWithIcon from "$lib/components/atoms/button/ButtonWithIcon.svelte";
  import { fade, slide, scale } from "svelte/transition";
  import Tooltip from "$lib/components/atoms/tooltip/Tooltip.svelte";
  import type { User } from "@supabase/supabase-js";
  import { cn } from "$lib/utils";

  interface props {
    menu: {
      label: string;
      icon: string;
      href: string;
      active: boolean;
      disabled?: boolean;
    }[];
    collapsed: boolean;
    user: User;
    variant: "light" | "dark";
  }
  const {
    menu: menuItems,
    collapsed: initialCollapsed,
    user,
    variant,
  }: props = $props();
  let collapsed = $state(initialCollapsed);

  let menu = $derived(menuItems.filter((item) => !item.disabled));
  const toggle = () => {
    collapsed = !collapsed;
  };

  function sidebarClasses() {
    return `
      h-screen shadow-md flex flex-col transition-all duration-300 rounded-r-2xl rounded-l-none
      fade-in-out transition-[width] duration-300 ease-in-out delay-75
      ${collapsed ? "w-20" : "w-64"}
      ${variant === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"}
    `;
  }

  const logout = () => {
    // Implement logout functionality here
  };
</script>

<div class={sidebarClasses()}>
  <!-- Header -->
  <div
    class={`${collapsed ? "p-2.5" : "p-4"} flex items-center justify-between border-b`}
  >
    {#if !collapsed}
      <h2 class="text-xl font-bold">RiesgosLaft</h2>
    {/if}
    <Tooltip
      active={collapsed}
      className="ml-4"
      content={collapsed ? "Expandir" : "Colapsar"}
      position="right"
    >
      <ButtonWithIcon
        label=""
        iconButton={collapsed ? "ChevronsRight" : "ChevronsLeft"}
        onclick={toggle}
        variant="ghost"
      />
    </Tooltip>
  </div>

  <!-- User Info -->
  {#if !collapsed}
    <UserInfo
      role={(user?.user_metadata?.role as any) || "Usuario"}
      name={(user?.user_metadata?.display_name as string) || "Usuario"}
      email={(user?.email as string) || "usuario@example.com"}
    />
  {/if}

  <!-- Menu -->
  <nav class="mt-6 p-1.5 gap-2 flex flex-col">
    {#each menu as item}
      <Tooltip
        active={collapsed}
        className="mx-2 my-1"
        content={item.label}
        position="right"
      >
        <MenuItem
          icon={item.icon}
          label={item.label}
          active={item.active}
          href={item.href}
          disabled={item.disabled}
          hiddenLabel={collapsed}
          className={collapsed ? "justify-center" : ""}
        />
      </Tooltip>
    {/each}
  </nav>

  <!-- Footer -->
  {#if !collapsed}
    <div class="mt-auto p-4 text-sm text-gray-500">© 2025 Mi App</div>
  {/if}
  {#if collapsed}
    <div class="flex flex-col mt-auto mb-4 items-center">
      <img
        src="https://img.icons8.com/ios-glyphs/30/000000/copyright.png"
        alt="copyright"
        class="mt-auto mx-auto my-4"
        transition:fade={{ duration: 200 }}
      />
      <ButtonWithIcon
        label={`${collapsed ? "" : "Cerrar sesión"}`}
        iconButton="LogOut"
        onclick={logout}
        variant="ghost"
      />
    </div>
  {/if}
</div>
