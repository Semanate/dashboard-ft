<script lang="ts">
  import Button from "$lib/components/atoms/button/Button.svelte";

  interface Props {
    active: number;
    categories: CategoryField[];
    onSelect?: (idx: number) => void;
    onchange?: (idx: number) => void;
  }

  const {
    active: initialActive = 0,
    categories,
    onSelect = () => {},
    onchange = () => {},
  }: Props = $props();

  console.log("CategoryTabs categories:", initialActive);
  let active = $state(initialActive);
</script>

<div class="flex gap-2 border-b border-b-gray-300 pb-2">
  {#each categories as cat, i}
    <Button
      label={cat.label}
      variant={i === active ? "primary" : "ghost"}
      onclick={() => {
        active = i;
        onSelect(i);
        onchange(i);
      }}
    />
  {/each}
</div>
