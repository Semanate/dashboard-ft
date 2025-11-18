<script lang="ts">
  import { cn } from "$lib/utils";
  import { ShieldAlert, ShieldX } from "@lucide/svelte";

  interface Props {
    label?: string;
    accept?: string;
    error?: string;
    variant?:
      | "default"
      | "primary"
      | "secondary"
      | "danger"
      | "success"
      | "warning"
      | "outline"
      | "ghost";
    id: string;
    disabled?: boolean;
    size?: "small" | "medium" | "large";
  }
  let file: File | null = $state(null);

  const {
    label = "",
    accept = "",
    variant = "default",
    size = "medium",
    id = "",
    error = "",
    disabled = false,
  }: Props = $props();

  function handleChange(e: Event) {
    const target = e.target as HTMLInputElement;
    file = target.files?.[0] ?? null;
  }

  function inputClass(sz = size, vr = variant, err = error, dis = disabled) {
    const base =
      "w-full border rounded-md px-3 py-2 text-sm transition-all duration-150 outline-none disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed";

    const sizes: Record<string, string> = {
      small: "text-sm h-10",
      medium: "text-base h-12",
      large: "text-lg h-14",
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
    <p
      class={cn(
        "block mb-1 text-sm font-medium",
        !error ? "text-gray-700" : "text-red-600"
      )}
    >
      {label}
    </p>
  {/if}

  <input
    type="file"
    id={id}
    {accept}
    {disabled}
    onchange={handleChange}
    class={inputClass()}
  />

  {#if error}
    <div class="mt-1 flex items-center text-red-600">
      <ShieldX class="mr-1" size="16" />
      <span>{error}</span>
    </div>
  {/if}

  {#if file}
    <p class="mt-1 text-sm text-gray-600">Archivo seleccionado: {file.name}</p>
    <div class="mt-1 flex items-center text-red-600">
      <ShieldAlert class="mr-1" size="16" />
      <span>Recuerda que este archivo será revisado por nuestro equipo.</span>
    </div>
  {/if}
</div>
