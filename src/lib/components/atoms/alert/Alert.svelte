<script lang="ts">
  import type { Snippet } from "svelte";
  import { cn } from "$lib/utils";
  import Icon from "../icon/Icon.svelte";

  interface AlertProps {
    /** @deprecated Use 'variant' instead */
    type?: "success" | "error" | "info" | "warning";
    variant?: "success" | "danger" | "info" | "warning" | "default";
    message?: string;
    title?: string;
    children?: Snippet;
    dismissible?: boolean;
    onDismiss?: () => void;
    class?: string;
  }

  const { 
    type, 
    variant = type === 'error' ? 'danger' : type || 'info', 
    message = "", 
    title,
    children,
    dismissible = false,
    onDismiss,
    class: className = ""
  }: AlertProps = $props();

  const variantStyles: Record<string, string> = {
    success: 'bg-green-50 border-green-200 text-green-800',
    danger: 'bg-red-50 border-red-200 text-red-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    default: 'bg-gray-50 border-gray-200 text-gray-800'
  };

  const iconNames: Record<string, string> = {
    success: 'CircleCheck',
    danger: 'CircleX',
    error: 'CircleX',
    info: 'Info',
    warning: 'AlertTriangle',
    default: 'FileText'
  };
</script>

<div
  class={cn(
    "p-4 rounded-lg border flex items-start gap-3",
    variantStyles[variant] || variantStyles.default,
    className
  )}
  role="alert"
>
  <span class="shrink-0">
    <Icon name={iconNames[variant] || iconNames.default} size={20} />
  </span>
  <div class="flex-1">
    {#if title}
      <h4 class="font-semibold mb-1">{title}</h4>
    {/if}
    {#if children}
      {@render children()}
    {:else if message}
      <span>{message}</span>
    {/if}
  </div>
  {#if dismissible && onDismiss}
    <button
      type="button"
      onclick={onDismiss}
      class="shrink-0 p-1 rounded-md hover:bg-black/10 transition-colors"
      aria-label="Cerrar"
    >
      <Icon name="X" size={16} />
    </button>
  {/if}
</div>
