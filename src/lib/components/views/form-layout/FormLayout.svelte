<script lang="ts">
  interface Props {
    title?: string;
    description?: string;
    width?: string;
    children?: () => any;
  }

  const {
    title,
    description,
    width = "max-w-2xl",
    children,
  } = $$props as Props;
</script>

<div class="w-full flex justify-center">
  <div
    class={`w-full ${width} bg-white border rounded-lg shadow p-6 space-y-6`}
  >
    {#if title || description}
      <header class="space-y-1">
        {#if title}
          <h2 class="text-xl font-semibold text-gray-800">{title}</h2>
        {/if}
        {#if description}
          <p class="text-gray-600 text-sm">{description}</p>
        {/if}
      </header>
    {/if}

    {#if children}
      {@render children()}
    {/if}
  </div>
</div>
