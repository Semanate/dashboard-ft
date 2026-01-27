<script lang="ts">
    import { cn } from "$lib/utils";

    interface Props {
        variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
        size?: 'sm' | 'md' | 'lg';
        label: string;
        icon?: string;
        class?: string;
    }

    const {
        variant = 'default',
        size = 'md',
        label,
        icon,
        class: className
    }: Props = $props();

    const variantClasses = {
        default: 'bg-gray-100 text-gray-700',
        primary: 'bg-indigo-100 text-indigo-700',
        secondary: 'bg-gray-200 text-gray-800',
        success: 'bg-green-100 text-green-700',
        warning: 'bg-yellow-100 text-yellow-700',
        danger: 'bg-red-100 text-red-700',
        info: 'bg-blue-100 text-blue-700'
    };

    const sizeClasses = {
        sm: 'text-xs px-2 py-0.5',
        md: 'text-sm px-3 py-1',
        lg: 'text-base px-4 py-1.5'
    };
</script>

<span class={cn(
    'inline-flex items-center gap-1 font-medium rounded-full',
    variantClasses[variant],
    sizeClasses[size],
    className
)}>
    {#if icon}
        <span>{icon}</span>
    {/if}
    {label}
</span>
