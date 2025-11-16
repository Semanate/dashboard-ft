<script lang="ts">
  import * as icons from "@lucide/svelte";

  interface Steps {
    label: string;
    completed: boolean;
    icon?: string;
  }
  interface Props {
    steps: Steps[];
    active?: number;
  }
  const { steps, active = 0 }: Props = $props();
  console.log(steps);
</script>

<div class="flex items-center gap-4">
  {#each steps as step, i}
    <div class="flex items-center gap-2">
      <div
        class="w-8 h-8 flex items-center justify-center rounded-full
          {i === active
          ? 'bg-blue-600 text-white'
          : 'bg-gray-300 text-gray-700'}"
      >
        {#if step.icon}
          {#if (icons as any)[step.icon]}
            {@const IconComponent = (icons as any)[step.icon]}
            <IconComponent
              class="w-4 h-4 {i === active ? 'text-white' : 'text-gray-600'}"
            />
          {/if}
        {/if}
        {#if !step.icon}
          <span class="font-semibold">{i + 1}</span>
        {/if}
      </div>

      <span class={i === active ? "font-semibold" : "text-gray-600"}>
        {step.label}
      </span>
    </div>

    {#if i < steps.length - 1}
      <div class="flex-1 h-[2px] bg-gray-300"></div>
    {/if}
  {/each}
</div>
