<script lang="ts">
    import { cn } from "$lib/utils";
    import Icon from "$lib/components/atoms/icon/Icon.svelte";

    interface Props {
        title: string;
        value: number | string;
        subtitle?: string;
        icon?: string;
        variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
        class?: string;
    }

    const {
        title,
        value,
        subtitle,
        icon,
        variant = 'default',
        class: className
    }: Props = $props();

    const variantClasses = {
        default: 'bg-white border-gray-200',
        primary: 'bg-indigo-50 border-indigo-200',
        success: 'bg-green-50 border-green-200',
        warning: 'bg-yellow-50 border-yellow-200',
        danger: 'bg-red-50 border-red-200',
        info: 'bg-blue-50 border-blue-200'
    };

    const textClasses = {
        default: 'text-gray-600',
        primary: 'text-indigo-600',
        success: 'text-green-600',
        warning: 'text-yellow-600',
        danger: 'text-red-600',
        info: 'text-blue-600'
    };

    const valueClasses = {
        default: 'text-gray-900',
        primary: 'text-indigo-700',
        success: 'text-green-700',
        warning: 'text-yellow-700',
        danger: 'text-red-700',
        info: 'text-blue-700'
    };
</script>

<div class={cn(
    'rounded-xl border p-6',
    variantClasses[variant],
    className
)}>
    <div class="flex items-center justify-between">
        <div>
            <p class={cn('font-medium', textClasses[variant])}>{title}</p>
            <p class={cn('text-4xl font-bold mt-1', valueClasses[variant])}>{value}</p>
            {#if subtitle}
                <p class="text-sm text-gray-500 mt-1">{subtitle}</p>
            {/if}
        </div>
        {#if icon}
            <span class={cn('opacity-60', textClasses[variant])}>
                <Icon name={icon} size={40} />
            </span>
        {/if}
    </div>
</div>
