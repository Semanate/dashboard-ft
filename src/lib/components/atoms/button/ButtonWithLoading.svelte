<script lang="ts">
  import { cn } from "$lib/utils";
  import { LoaderCircle } from "@lucide/svelte";
  interface Props {
    variant?: "primary" | "secondary" | "tertiary" | "default" | "ghost";
    size?: "small" | "medium" | "large";
    label: string;
    onclick?: () => void;
    loading?: boolean;
    children?: any;
  }

  const {
    variant = "primary",
    size = "medium",
    loading = false,
    label,
    children,
    ...props
  }: Props = $props();

  function buttonClass(type: string = variant, sz: string = size) {
    const base =
      "flex flex-row items-center rounded px-4 py-2 font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 hover:cursor-pointer transition-colors duration-200";
    const variants: Record<string, string> = {
      primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
      secondary:
        "bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-500",
      tertiary:
        "bg-transparent text-blue-600 hover:bg-blue-50 focus:ring-blue-500",
      default: "bg-white text-black hover:bg-gray-100 focus:ring-gray-500",
      ghost: "bg-transparent hover:bg-gray-100 focus:ring-gray-500",
    };
    const sizes: Record<string, string> = {
      small: "text-sm",
      medium: "text-base",
      large: "text-lg",
    };

    return cn(base, variants[type], sizes[sz]);
  }
</script>

<button type="button" class={buttonClass()} {...props} disabled={loading}>
  {#if loading}
    <LoaderCircle class="animate-spin mr-2" size="16" />
  {/if}
  {label}

  {#if children}
    {@render children()}
  {/if}
</button>
