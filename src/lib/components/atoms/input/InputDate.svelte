<script lang="ts">
  import { ArrowLeft, ArrowRight } from "@lucide/svelte";
  import Button from "$lib/components/atoms/button/Button.svelte";
  import { cn } from "$lib/utils";

  type ViewMode = "day" | "month" | "year";

  interface Props {
    label?: string;
    placeholder?: string;
    error?: string;
    disabled?: boolean;
    value?: Date | null;
    id: string;
    required?: boolean;
    onchange?: (value: Date | null) => void;
    size?: "small" | "medium" | "large";
    mode?: "default" | "birthdate";
  }

  const {
    label = "",
    placeholder = "Seleccionar fecha",
    error = "",
    size = "small",
    id = "",
    required = false,
    disabled = false,
    onchange,
    value: initialValue,
    mode = "default",
  }: Props = $props();

  let selected = $state<Date | null>(null);
  let current = $state(new Date());
  let show = $state(false);
  let view = $state<ViewMode>("day");
  let calendarRef: HTMLDivElement | null = $state(null);

  const locale = "es-CO";

  const monthFormatter = new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  });

  const dateFormatter = new Intl.DateTimeFormat(locale);

  const dayFormatter = new Intl.DateTimeFormat(locale, {
    weekday: "short",
  });

  let weekDays = $state<string[]>([]);

  // Sync initial value
  $effect(() => {
    if (initialValue) {
      const d = new Date(initialValue);
      selected = d;
      current = new Date(d.getFullYear(), d.getMonth(), 1);
    } else if (mode === "birthdate") {
      view = "year";
    }
  });

  $effect(() => {
    const base = new Date(2024, 0, 7);
    weekDays = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      return dayFormatter.format(d);
    });
  });

  function toggle() {
    if (!disabled) show = !show;
  }

  function handleClickOutside(e: MouseEvent) {
    if (calendarRef && !calendarRef.contains(e.target as Node)) show = false;
  }

  $effect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  });

  function selectDay(day: number) {
    selected = new Date(current.getFullYear(), current.getMonth(), day);
    show = false;
    onchange?.(selected);
  }

  function prevMonth() {
    current = new Date(current.getFullYear(), current.getMonth() - 1, 1);
  }

  function nextMonth() {
    current = new Date(current.getFullYear(), current.getMonth() + 1, 1);
  }

  function daysInMonth() {
    return new Date(current.getFullYear(), current.getMonth() + 1, 0).getDate();
  }

  function firstDayOfMonth() {
    return new Date(current.getFullYear(), current.getMonth(), 1).getDay();
  }

  function getYears() {
    const currentYear = new Date().getFullYear();
    const start = mode === "birthdate" ? currentYear - 100 : currentYear - 50;
    return Array.from({ length: 101 }, (_, i) => start + i);
  }

  function inputClass() {
    const sizes = {
      small: "h-8 text-sm",
      medium: "h-10 text-base",
      large: "h-12 text-lg",
    };

    return cn(
      "w-full border rounded-md px-3 text-left bg-white cursor-pointer focus:ring-2 transition",
      sizes[size],
      error
        ? "border-red-500 focus:ring-red-400"
        : "border-gray-300 focus:ring-primary-600",
      disabled && "bg-gray-100 cursor-not-allowed text-gray-400",
    );
  }
</script>

<div class="relative w-full">
  {#if label}
    <label for={id} class="block mb-1 text-sm font-medium text-gray-700">
      {label}{required ? " *" : ""}
    </label>
  {/if}

  <button class={inputClass()} onclick={toggle} {id}>
    {#if selected}
      {dateFormatter.format(selected)}
    {:else}
      <span class="text-gray-400">{placeholder}</span>
    {/if}
  </button>

  {#if error}
    <p class="mt-1 text-sm text-red-600">{error}</p>
  {/if}

  {#if show}
    <div
      bind:this={calendarRef}
      class="absolute z-20 mt-2 w-72 bg-white border rounded-2xl shadow-lg p-3"
    >
      <!-- HEADER -->
      <div class="flex justify-between items-center mb-2">
        <Button variant="ghost" size="small" onclick={prevMonth}>
          <ArrowLeft size="20" />
        </Button>

        <button
          class="font-semibold capitalize hover:bg-gray-100 rounded px-2 py-1"
          onclick={() =>
            (view =
              view === "day" ? "month" : view === "month" ? "year" : "day")}
        >
          {monthFormatter.format(current)}
        </button>

        <Button variant="ghost" size="small" onclick={nextMonth}>
          <ArrowRight size="20" />
        </Button>
      </div>

      <!-- YEAR VIEW -->
      {#if view === "year"}
        <div class="grid grid-cols-4 gap-2 max-h-60 overflow-auto">
          {#each getYears() as y}
            <Button
              variant="ghost"
              size="small"
              label={y.toString()}
              onclick={() => {
                current = new Date(y, current.getMonth(), 1);
                view = "month";
              }}
            />
          {/each}
        </div>
      {/if}

      <!-- MONTH VIEW -->
      {#if view === "month"}
        <div class="grid grid-cols-3 gap-2">
          {#each Array(12) as _, i}
            <Button
              variant="ghost"
              size="small"
              label={new Intl.DateTimeFormat(locale, { month: "short" }).format(
                new Date(2024, i, 1),
              )}
              onclick={() => {
                current = new Date(current.getFullYear(), i, 1);
                view = "day";
              }}
            />
          {/each}
        </div>
      {/if}

      <!-- DAY VIEW -->
      {#if view === "day"}
        <div class="grid grid-cols-7 text-xs text-center mb-1 text-gray-500">
          {#each weekDays as d}
            <span class="font-semibold">{d}</span>
          {/each}
        </div>

        <div class="grid grid-cols-7 gap-1 text-center">
          {#each Array(firstDayOfMonth()) as _}
            <div></div>
          {/each}

          {#each Array(daysInMonth()) as _, i}
            <Button
              variant="ghost"
              size="small"
              label={(i + 1).toString()}
              onclick={() => selectDay(i + 1)}
            />
          {/each}
        </div>
      {/if}
    </div>
  {/if}
</div>
