<script lang="ts">
  import type { OptionsSelects } from "$lib/types";
  import { cn } from "$lib/utils";

  interface Props {
    label?: string;
    id: string;
    placeholder?: string;
    options?: Array<OptionsSelects<any>>;
    error?: string;
    variant?:
      | "default"
      | "primary"
      | "secondary"
      | "danger"
      | "success"
      | "outline"
      | "ghost";
    value?: any;
    disabled?: boolean;
    size?: "small" | "medium" | "large";
    onchange?: (value: any) => void;
  }

  let open = $state(false);

  const {
    value: initialValue,
    label,
    placeholder = "Select an option",
    disabled = false,
    error,
    options = [],
    id = "",
    variant = "default",
    onchange,
    size = "medium",
  }: Props = $props();

  let value = $state(initialValue);

  function inputClass(sz = size, vr = variant, err = error, dis = disabled) {
    const base =
      "w-full border rounded-sm px-3 py-2 transition-all duration-150 outline-none disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed text-left flex justify-between items-center";
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
    return cn(
      base,
      sizes[sz],
      variants[vr],
      err ? "border-red-500" : "",
      dis
        ? "disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
        : "",
    );
  }

  function toggle() {
    if (!disabled) open = !open;
  }

  function selectOption(opt: any) {
    value = opt.value;
    open = false;
    if (onchange) onchange(value);
  }
</script>

<div class="relative w-full">
  {#if label}
    <label for={id} class="block mb-1 text-sm text-gray-700 font-medium"
      >{label}</label
    >
  {/if}

  <button class={inputClass()} onclick={toggle} {id} name={id}>
    <span class={value ? "text-gray-900" : "text-gray-400"}>
      {value ? options.find((opt) => opt.value === value)?.label : placeholder}
    </span>

    <span class="text-gray-500">▾</span>
  </button>

  <input type="hidden" name={id} {id} {value} required={!!error || undefined} />

  {#if error}
    <p class="mt-1 text-sm text-red-600">{error}</p>
  {/if}

  {#if open}
    <div
      class="absolute left-0 top-full mt-1 w-full bg-white border border-gray-300 flex flex-col items-start
             rounded shadow z-99 max-h-48 overflow-auto"
    >
      {#each options as opt}
        <button
          type="button"
          tabindex="0"
          class="px-3 py-2 hover:bg-gray-100 cursor-pointer w-full text-left"
          onclick={() => selectOption(opt)}
        >
          {opt.label}
        </button>
      {/each}
    </div>
  {/if}
</div>
