<script lang="ts">
  import { cn } from "$lib/utils";

  interface Props {
    label: string;
    checked?: boolean;
    disabled?: boolean;
    error?: string;
    id: string;
    variant?:
      | "default"
      | "primary"
      | "secondary"
      | "danger"
      | "success"
      | "warning"
      | "outline"
      | "ghost";
    size?: "small" | "medium" | "large";
  }
  const props: Props = $props();

  let {
    label,
    disabled = false,
    error = "",
    variant = "primary",
    size = "medium",
    id = ""
  } = props;

  let checked = props.checked ?? false;

  function inputClass(sz = size, vr = variant, err = error, dis = disabled) {
    const base =
      "rounded border transition-all duration-150 outline-none focus:ring-2 focus:outline-non focus:ring-transparent";

    const sizes: Record<string, string> = {
      small: "w-4 h-4",
      medium: "w-5 h-5",
      large: "w-6 h-6",
    };

    const variants: Record<string, string> = {
      default: "border-gray-300 text-gray-900 focus:ring-2 focus:ring-gray-400",
      primary:
        "border-primary-500 text-primary-600 focus:ring-2 focus:ring-primary-400",
      secondary:
        "border-gray-300 text-gray-900 focus:ring-2 focus:ring-gray-500",
      danger: "border-red-500 text-red-600 focus:ring-2 focus:ring-red-400",
      success:
        "border-green-500 text-green-600 focus:ring-2 focus:ring-green-400",
      warning:
        "border-yellow-500 text-yellow-600 focus:ring-2 focus:ring-yellow-400",
      outline: "border-gray-400 text-gray-800 focus:ring-2 focus:ring-gray-500",
      ghost:
        "border-transparent text-gray-700 focus:ring-2 focus:ring-gray-400",
    };

    return cn(
      base,
      sizes[sz],
      variants[vr],
      err && "border-red-500",
      dis && "text-gray-400 cursor-not-allowed"
    );
  }
</script>

<div
  class={cn(
    "flex items-center gap-2",
    disabled ? "cursor-not-allowed" : "cursor-pointer"
  )}
>
  <input
    id={id ?? "input-check"}
    name={id ?? "input-check"}
    type="checkbox"
    bind:checked
    {disabled}
    class={cn(
      inputClass(),
      variant === "default" && "accent-gray-600",
      variant === "primary" && "accent-primary-600",
      variant === "secondary" && "accent-gray-500",
      variant === "danger" && "accent-red-600",
      variant === "success" && "accent-green-600",
      variant === "warning" && "accent-yellow-600",
      variant === "outline" && "accent-gray-600",
      variant === "ghost" && "accent-gray-700",
      !disabled && "hover:cursor-pointer",
      disabled && "cursor-not-allowed"
    )}
  />

  <label class="text-gray-800 hover:cursor-pointer" for={id ?? "input-check"}
    >{label}</label
  >
</div>

{#if error}
  <p class="mt-1 text-sm text-red-600">{error}</p>
{/if}
