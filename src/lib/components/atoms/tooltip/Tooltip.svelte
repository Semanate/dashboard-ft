<script lang="ts">
  import { cn } from "$lib/utils";
  import { fade, scale } from "svelte/transition";

  interface Props {
    content: string;
    position?: "top" | "bottom" | "left" | "right";
    children: any;
    active: boolean;
    className?: string;
    showDelay?: number;
  }

  const {
    content,
    className = "",
    position = "top",
    children,
    active = false,
    showDelay = 120,
  }: Props = $props();

  let visible = $state(false);

  function tooltipClasses() {
    const baseClass = `
      absolute z-[9999] px-2 py-1 text-xs font-medium text-gray-700
      bg-white/70 rounded-md shadow-md
      whitespace-nowrap pointer-events-none select-none

      ${position === "top" ? "bottom-full left-1/2 -translate-x-1/2 mb-2" : ""}
      ${position === "bottom" ? "top-full left-1/2 -translate-x-1/2 mt-2" : ""}
      ${position === "left" ? "right-full top-1/2 -translate-y-1/2 mr-2" : ""}
      ${position === "right" ? "left-full top-1/2 -translate-y-1/2 ml-2" : ""}
    `;
    return cn(baseClass, className);
  }

  function handleMouseEnter() {
    if (active) visible = true;
  }
  function handleMouseLeave() {
    visible = false;
  }
</script>

<div
  class="relative inline-block overflow-visible"
  on:mouseenter={handleMouseEnter}
  on:mouseleave={handleMouseLeave}
>
  <!-- Contenido del trigger -->
  {@render children?.()}

  <!-- Tooltip -->
  {#if visible}
    <div
      class={tooltipClasses()}
      transition:fade={{ duration: 120, delay: showDelay }}
    >
      {content}
    </div>
  {/if}
</div>
