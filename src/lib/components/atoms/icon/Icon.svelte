<script lang="ts">
  import * as Icons from "@lucide/svelte";

  interface Props {
    name: string;
    size?: number;
    className?: string;
  }
  const { name, size = 24, className = "" }: Props = $props();

  const IconComponent = (Icons as any)[name];
</script>

{#if (Icons as any )[name]}
  {@const IconComponent = (Icons as any)[name]}
  <IconComponent size={size} class={className} />
{/if}
