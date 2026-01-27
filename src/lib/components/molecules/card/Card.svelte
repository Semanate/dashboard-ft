<script lang="ts">
  import { cn } from "$lib/utils";

  interface CardProps {
    title: string;
    content?: string;
    children?: any;
    class?: string;
  }

  const { title, content, children, class: className }: CardProps = $props();

  function cardClass() {
    if (className) {
      return cn(className);
    }

    return cn(
      "bg-white",
      "shadow-md",
      "rounded-lg",
      "p-6",
      "border",
      "border-gray-200"
    );
  }
</script>

<div class={cardClass()}>
  {#if title}
    <h2 class="text-xl font-semibold mb-4">{title}</h2>
  {/if}
  {#if content}
    <p class="text-gray-700">{content}</p>
  {/if}
  {#if children}
      {@render children()}
  {/if}
</div>
