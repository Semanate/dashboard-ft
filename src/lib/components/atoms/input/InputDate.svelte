<script lang="ts">
  import { ArrowLeft, ArrowRight } from "@lucide/svelte";
  import Button from "$lib/components/atoms/button/Button.svelte";

  interface Props {
    label?: string;
    placeholder?: string;
    error?: string;
    disabled?: boolean;
    value?: Date | null;
    id: string;
  }

  const {
    label = "",
    placeholder = "Select a date",
    error = "",
    id = "",
    disabled = false,
    value: initialValue,
  }: Props = $props();

  let value: Date | null = $state(initialValue || null);

  let show = $state(false);
  let calendarRef: HTMLDivElement | null = $state(null);

  let locale = navigator.language || "en-US";

  let current = $state(new Date());
  let selected = $state<Date | null>(null);

  let monthFormatter = new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  });

  let dayFormatter = new Intl.DateTimeFormat(locale, {
    weekday: "short",
  });

  let dateFormatter = new Intl.DateTimeFormat(locale);

  let weekDays = $state<string[]>([]);

  $effect(() => {
    const base = new Date(2024, 0, 7);
    weekDays = Array.from({ length: 7 }, (_, i) => {
      let d = new Date(base);
      d.setDate(base.getDate() + i);
      return dayFormatter.format(d);
    });
  });

  function handleClickOutside(e: MouseEvent) {
    if (calendarRef && !calendarRef.contains(e.target as Node)) show = false;
  }

  $effect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  });

  function toggle() {
    if (!disabled) show = !show;
  }

  function select(day: number) {
    selected = new Date(current.getFullYear(), current.getMonth(), day);
    value = selected;
    show = false;
  }

  function prevMonth() {
    current = new Date(current.getFullYear(), current.getMonth() - 1, 1);
  }

  function nextMonth() {
    current = new Date(current.getFullYear(), current.getMonth() + 1, 1);
  }

  function firstDayOfMonth() {
    return new Date(current.getFullYear(), current.getMonth(), 1).getDay();
  }

  function daysInMonth() {
    return new Date(current.getFullYear(), current.getMonth() + 1, 0).getDate();
  }
</script>

<div class="relative inline-block w-full">
  {#if label}
    <label class="block mb-1 text-sm text-gray-700 font-medium">{label}</label>
  {/if}

  <div
    aria-label="text"
    class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm cursor-pointer bg-white
           focus:ring-2 transition disabled:bg-gray-100"
    class:border-red-500={error}
    onclick={toggle}
    id={id}
  >
    {#if selected}
      {dateFormatter.format(selected)}
    {:else}
      <span class="text-gray-400">{placeholder}</span>
    {/if}
  </div>

  {#if error}
    <p class="mt-1 text-sm text-red-600">{error}</p>
  {/if}

  <!-- POPUP -->
  {#if show}
    <div
      bind:this={calendarRef}
      class="absolute mt-2 w-72 bg-white border border-gray-300 rounded-2xl shadow-lg p-3 transition delay-75 z-10"
    >
      <div class="flex justify-between items-center mb-2">
        <Button onclick={prevMonth} variant="ghost" size="small" label="">
          <ArrowLeft size="24" />
        </Button>

        <span class="font-semibold capitalize">
          {monthFormatter.format(current)}
        </span>

        <Button variant="ghost" size="small" onclick={nextMonth} label="">
          <ArrowRight size="24" />
        </Button>
      </div>

      <div
        class="grid grid-cols-7 text-xs text-center text-gray-500 mb-1 select-none"
      >
        {#each weekDays as d}
          <span class="font-sans font-semibold">{d}</span>
        {/each}
      </div>

      <div class="grid grid-cols-7 gap-1 text-center text-sm select-none mt-2">
        {#each Array(firstDayOfMonth()) as _}
          <div></div>
        {/each}
        {#each Array(daysInMonth()) as _, dayIndex}
          {@const day = dayIndex + 1}
          <Button
            variant="ghost"
            size="small"
            onclick={() => select(day)}
            label={day.toString()}
          />
        {/each}
      </div>
    </div>
  {/if}
</div>
