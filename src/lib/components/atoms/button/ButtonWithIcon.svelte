<script lang="ts">
  import { cn } from "$lib/utils";
  import Icon from "../icon/Icon.svelte";
  interface Props {
    variant?: "primary" | "secondary" | "tertiary" | "default" | "ghost" | "danger" | "success" | "warning" | "info";
    size?: "small" | "medium" | "large";
    label: string;
    type?: "button" | "submit" | "reset";
    onclick?: () => void;
    loading?: boolean;
    children?: any;
    hidden?: boolean;
    disabled?: boolean;
    class?: string;
    iconButton?: string;
  }

  const {
    variant = "primary",
    disabled = false,
    size = "medium",
    hidden = false,
    loading = false,
    label,
    class: classNames,
    children,
    iconButton,
    ...props
  }: Props = $props();

  function buttonClass(type: string = variant, sz: string = size) {
    const base =
      "flex flex-row items-center rounded px-4 py-2 font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 hover:cursor-pointer transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
    const variants: Record<string, string> = {
      primary:
        "bg-primary/70 text-white hover:bg-primary-700 focus:ring-primary/20",
      secondary:
        "bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-500",
      tertiary:
        "bg-transparent text-blue-600 hover:bg-blue-50 focus:ring-blue-500",
      default: "bg-white text-black hover:bg-gray-100 focus:ring-gray-500",
      ghost:
        "bg-transparent hover:bg-gray-100 focus:ring-gray-200 outline-none",
      danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
      success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
      warning: "bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500",
      info: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    };
    const sizes: Record<string, string> = {
      small: "text-sm h-6",
      medium: "text-base h-10",
      large: "text-lg h-12",
    };

    return cn(base, variants[type], sizes[sz], classNames ?? "");
  }
</script>

<button
  hidden={hidden}
  type={props.type ?? "button"}
  class={buttonClass()}
  {...props}
  disabled={  disabled || loading}
>
  {#if iconButton}
    <Icon name={iconButton} />
  {/if}
  <p class="text-center ml-2">{label}</p>

  {#if children}
    {@render children()}
  {/if}
</button>
