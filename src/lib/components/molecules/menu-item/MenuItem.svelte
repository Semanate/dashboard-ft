<script lang="ts">
  import Icon from "$lib/components/atoms/icon/Icon.svelte";
  import { cn } from "$lib/utils";

  interface MenuItemProps {
    label: string;
    icon?: string;
    href?: string;
    active?: boolean;
    disabled?: boolean;
    hiddenLabel?: boolean;
    className?: string;
  }

  const {
    label,
    icon,
    hiddenLabel = false,
    href = "#",
    active = false,
    className = "",
    disabled = false,
  }: MenuItemProps = $props();

  console.log({ label, icon, href, active, disabled });

  function menuItemClasses() {
    return cn(
      "flex items-center gap-3 px-4 py-2 rounded-md transition-colors select-none items-center hover:bg-gray-100",
      "bg-white text-gray-700 hover:bg-gray-100",
      disabled && "cursor-not-allowed opacity-50 pointer-events-none",
      active &&
        "bg-primary/10 text-primary font-semibold border border-primary/30",
      className
    );
  }
</script>

<a {href} class={menuItemClasses()}>
  {#if icon}
    <Icon name={icon} size={20} className="text-gray-600" />
  {/if}
  {#if !hiddenLabel}
    <span>{label}</span>
  {/if}
</a>
