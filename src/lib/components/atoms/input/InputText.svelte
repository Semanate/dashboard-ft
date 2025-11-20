<script lang="ts">
  import { cn } from "$lib/utils";

  interface Props {
    label?: string;
    placeholder?: string;
    type: "text" | "password" | "email" | "number" | "url" | "tel";
    error?: string;
    id: string;
    size?: "small" | "medium" | "large";
    variant?:
      | "default"
      | "primary"
      | "secondary"
      | "danger"
      | "success"
      | "warning"
      | "outline"
      | "ghost";
    disabled?: boolean;
    value?: string;
    required?: boolean;
    onchange?: any;
  }

  const {
    label = "",
    placeholder = "",
    error = "",
    value = "",
    disabled = false,
    type = "text",
    size = "small",
    id = "",
    onchange,
    required = false,
    variant = "default",
  }: Props = $props();
  console.log("InputText props:", required);

  function inputClass(sz = size, vr = variant, err = error, dis = disabled) {
    const base =
      "w-full border rounded-sm px-3 py-2 transition-all duration-150 outline-none disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed";

    const sizes: Record<string, string> = {
      small: "text-sm h-8",
      medium: "text-base h-10",
      large: "text-lg h-12",
    };

    const variants: Record<string, string> = {
      default:
        "bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-gray-400",
      primary:
        "bg-white border-blue-500 text-gray-900 focus:ring-2 focus:ring-blue-400",
      secondary:
        "bg-gray-100 border-gray-300 text-gray-900 focus:ring-2 focus:ring-gray-500",
      danger:
        "bg-white border-red-500 text-red-700 focus:ring-2 focus:ring-red-400",
      success:
        "bg-white border-green-500 text-green-700 focus:ring-2 focus:ring-green-400",
      warning:
        "bg-white border-yellow-500 text-yellow-700 focus:ring-2 focus:ring-yellow-400",
      outline:
        "bg-transparent border-gray-400 text-gray-800 focus:ring-2 focus:ring-gray-500",
      ghost:
        "bg-transparent border-transparent text-gray-700 focus:ring-2 focus:ring-gray-400",
    };

    const errorVariant =
      "border-red-500 text-red-700 focus:ring-red-400 placeholder:text-red-400";

    return cn(
      base,
      sizes[sz],
      variants[vr],
      err && errorVariant,
      dis && "opacity-60"
    );
  }
</script>

<div class="flex flex-col gap-1">
  {#if label}
    <label class="text-sm font-medium text-gray-700" for={id}
      >{label}
      {#if required}
        <span class="text-red-500">*</span>
      {/if}
    </label>
  {/if}

  <input
    {id}
    {required}
    name={id}
    aria-label={label}
    {type}
    class={inputClass(size, variant, error, disabled)}
    {placeholder}
    {disabled}
    onchange={(e) => onchange && onchange(e.target.value)}
    {value}
  />

  {#if error}
    <p class="text-red-500 text-xs">{error}</p>
  {/if}
</div>
