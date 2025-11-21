<script lang="ts">
  import * as icons from "@lucide/svelte";
  import { fly } from "svelte/transition";

  interface Steps {
    label: string;
    completed: boolean;
    icon?: string;
  }

  interface Props {
    steps: Steps[];
    active?: number;
    chunkSize?: number;
  }

  const { steps, active = 0, chunkSize = 2 }: Props = $props();

  let windowStart = $derived.by(() => {
    if (!steps || steps.length === 0) return 0;
    if (!chunkSize || chunkSize <= 0) return 0;

    if (steps.length <= chunkSize) return 0;

    let start = active - chunkSize + 1;
    if (start < 0) start = 0;

    if (start + chunkSize > steps.length) {
      start = Math.max(0, steps.length - chunkSize);
    }

    return start;
  });

  let visibleSteps = $derived.by(() =>
    steps.slice(windowStart, Math.min(windowStart + chunkSize, steps.length))
  );
</script>

{#key windowStart}
  <div
    class="flex items-center gap-4"
    transition:fly|local={{ x: 40, duration: 250, easing: (t) => t * t }}
  >
    {#each visibleSteps as step, i}
      {@const realIndex = windowStart + i}

      <div class="flex items-center gap-2">
        <div
          class="w-8 h-8 flex items-center justify-center rounded-full
            {realIndex === active
            ? 'bg-primary-600 text-white'
            : 'bg-gray-300 text-gray-700'}"
        >
          {#if step.icon}
            {@const IconComponent = (icons as any)[step.icon]}
            <IconComponent
              class="w-4 h-4 {realIndex === active
                ? 'text-white'
                : 'text-gray-600'}"
            />
          {:else}
            <span class="font-semibold">{realIndex + 1}</span>
          {/if}
        </div>

        <span class={realIndex === active ? "font-semibold" : "text-gray-600"}>
          {step.label}
        </span>
      </div>

      {#if i < visibleSteps.length - 1}
        <div class="flex-1 h-[2px] bg-gray-300"></div>
      {/if}
    {/each}
  </div>
{/key}
