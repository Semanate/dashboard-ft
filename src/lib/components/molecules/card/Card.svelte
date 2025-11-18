<script lang="ts">
  interface CardProps {
    title: string;
    content: string;
    children?: any;
  }

  const { title, content, children }: CardProps = $props();
</script>

<div class="border border-gray-300 rounded-lg shadow-md p-6 bg-white">
  <h2 class="text-xl font-semibold mb-4">{title}</h2>
  <p class="text-gray-700">{content}</p>
  {#if children}
    <div class="mt-4">
      {@render children()}
    </div>
  {/if}
</div>
