<script lang="ts">
  import MenuItem from "$lib/components/molecules/menu-item/MenuItem.svelte";
  import UserInfo from "$lib/components/molecules/user-info/UserInfo.svelte";
  import ButtonWithIcon from "$lib/components/atoms/button/ButtonWithIcon.svelte";

  interface props {
    menu: { label: string; icon: string; href: string }[];
    collapsed: boolean;
  }
  const { menu, collapsed: initialCollapsed }: props = $props();
  let collapsed = $state(initialCollapsed);

  const toggle = () => {
    collapsed = !collapsed;
  };
</script>

<div
  class="h-screen bg-primary border-r shadow-md flex flex-col transition-all duration-300
    {collapsed ? 'w-20' : 'w-64'}
  "
>
  <!-- Header -->
  <div class="flex items-center justify-between p-4">
    <span class={collapsed ? "hidden" : "font-bold text-lg"}>Mi Panel</span>

    <ButtonWithIcon label="Menu" iconButton="menu" onclick={toggle} />
  </div>

  <!-- User Info -->
  {#if !collapsed}
    <UserInfo name="Kevin Alvear" email="kevin@example.com" />
  {/if}

  <!-- Menu -->
  <nav class="mt-6 flex flex-col">
    {#each menu as item}
      <MenuItem icon={item.icon} label={item.label} href={item.href} />
    {/each}
  </nav>

  <!-- Footer -->
  {#if !collapsed}
    <div class="mt-auto p-4 text-sm text-gray-500">© 2025 Mi App</div>
  {/if}
</div>
