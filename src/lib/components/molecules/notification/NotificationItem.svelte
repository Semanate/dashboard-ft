<script lang="ts">
    import {
        type Notification,
        notificationState,
    } from "$lib/stores/notifications.svelte";
    import Icon from "$lib/components/atoms/icon/Icon.svelte";
    import { fly, fade } from "svelte/transition";
    import { cn } from "$lib/utils";

    let { notification }: { notification: Notification } = $props();

    const variantStyles = {
        success: "border-green-500 text-green-800 bg-white/90 shadow-green-100",
        error: "border-red-500 text-red-800 bg-white/90 shadow-red-100",
        warning:
            "border-yellow-500 text-yellow-800 bg-white/90 shadow-yellow-100",
        info: "border-blue-500 text-blue-800 bg-white/90 shadow-blue-100",
    };

    const iconNames = {
        success: "CircleCheck",
        error: "CircleX",
        warning: "AlertTriangle",
        info: "Info",
    };

    const currentStyle = $derived(
        variantStyles[notification.type] || variantStyles.info,
    );
    const currentIcon = $derived(
        iconNames[notification.type] || iconNames.info,
    );

    function handleDismiss() {
        notificationState.remove(notification.id);
    }
</script>

<div
    class={cn(
        "pointer-events-auto flex w-full max-w-md rounded-lg border-l-4 shadow-lg backdrop-blur-sm ring-1 ring-black/5 p-4 gap-4 transition-all duration-300 hover:scale-[1.02]",
        currentStyle,
    )}
    in:fly={{ x: 300, duration: 300 }}
    out:fly={{ x: 100, duration: 200, opacity: 0 }}
    role="alert"
>
    <div class="shrink-0">
        <Icon name={currentIcon} size={24} />
    </div>
    <div class="flex-1 pt-0.5">
        {#if notification.title}
            <h3 class="font-semibold text-sm mb-1">{notification.title}</h3>
        {/if}
        <p class="text-sm opacity-90 leading-relaxed">
            {notification.message}
        </p>
    </div>
    <button
        onclick={handleDismiss}
        class="shrink-0 flex self-start -mt-1 -mr-1 p-1 rounded-full hover:bg-black/5 transition-colors"
        aria-label="Close"
    >
        <Icon name="X" size={16} />
    </button>
</div>
