<script lang="ts">
    interface Props {
        title: string;
        subtitle?: string;
        icon?: string;
        children?: any; // Para acciones (botones)
    }

    const {
        title,
        subtitle,
        icon,
        children
    }: Props = $props();
</script>

<div class="mb-8 flex flex-wrap justify-between items-start gap-4">
    <div>
        <h1 class="text-3xl font-bold text-gray-900 flex items-center gap-3">
            {#if icon}
                <span>{icon}</span>
            {/if}
            {title}
        </h1>
        {#if subtitle}
            <p class="mt-2 text-gray-600">{subtitle}</p>
        {/if}
    </div>
    
    {#if children}
        <div class="flex gap-2 flex-wrap">
            {@render children()}
        </div>
    {/if}
</div>
