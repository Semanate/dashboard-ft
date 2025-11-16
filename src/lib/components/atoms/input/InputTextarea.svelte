<script lang="ts">
  import { cn } from "$lib/utils";

  interface Props {
    label?: string;
    placeholder?: string;
    error?: string;
    rows?: number;
    disabled?: boolean;
    value?: string;
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
    label = "",
    placeholder = "",
    error = "",
    rows = 4,
    disabled = false,
    value = "",
    variant = "default",
    size = "medium",
  } = props;

  function textareaClass(sz = size, vr = variant, err = error, dis = disabled) {
    const base =
      "w-full border rounded-md px-3 py-2 text-sm resize-none transition-all duration-150 outline-none disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed";

    const sizes: Record<string, string> = {
      small: "text-sm h-20",
      medium: "text-base h-24",
      large: "text-lg h-32",
    };

    const variants: Record<string, string> = {
      default: "bg-white border-gray-500 text-gray-900 ",
      primary: "bg-white border-blue-500 text-gray-900 ",
      secondary: "bg-gray-100 border-gray-300 text-gray-900 ",
      danger: "bg-white border-red-500 text-red-700 focus:ring-red-400",
      success: "bg-white border-green-500 text-green-700  focus:ring-green-400",
      warning:
        "bg-white border-yellow-500 text-yellow-700  focus:ring-yellow-400",
      outline:
        "bg-transparent border-gray-400 text-gray-800  focus:ring-gray-500",
      ghost:
        "bg-transparent border-transparent text-gray-700  focus:ring-gray-400",
    };

    return cn(
      base,
      sizes[sz],
      variants[vr],
      err ? "border-red-500" : "",
      dis
        ? "disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
        : ""
    );
  }
</script>

<div class="w-full">
  {#if label}
    <label class="block mb-1 text-sm font-medium text-gray-700">{label}</label>
  {/if}

  <textarea
    {rows}
    class={textareaClass(size, variant, error, disabled)}
    bind:value
    {placeholder}
    {disabled}
  />

  {#if error}
    <p class="mt-1 text-sm text-red-600">{error}</p>
  {/if}
</div>
