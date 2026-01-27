<script lang="ts">
  import { cn } from "$lib/utils";

  interface Props {
    variant?: "primary" | "secondary" | "tertiary" | "default" | "ghost" | "danger";
    size?: "small" | "medium" | "large";
    label: string;
    onclick?: () => void;
    children?: any;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
    class?: string;
  }

  const {
    variant = "primary",
    size = "medium",
    label,
    disabled = false,
    children,
    type = "button",
    class: className = "",
    ...props
  }: Props = $props();

  function buttonClass(type: string = variant, sz: string = size) {
    const base =
      "rounded px-4 py-2 font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 hover:cursor-pointer transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
    const variants: Record<string, string> = {
      primary: "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500",
      secondary:
        "bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-500",
      tertiary:
        "bg-transparent text-primary-600 hover:bg-primary-50 focus:ring-primary-500",
      default: "bg-white text-black hover:bg-gray-100 focus:ring-gray-500",
      ghost: "bg-transparent hover:bg-gray-100 focus:ring-gray-500",
      danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    };
    const sizes: Record<string, string> = {
      small: "text-sm",
      medium: "text-base",
      large: "text-lg",
    };

    return cn(base, variants[type], sizes[sz], className);
  }
</script>

<button type={type} class={buttonClass()} {disabled} {...props}>
  {label}
  {#if children}
    {@render children()}
  {/if}
</button>
