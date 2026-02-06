<script lang="ts">
    import { notificationState } from "$lib/stores/notifications.svelte";
    import { notificationService } from "$lib/services/notification.service";
    import Icon from "$lib/components/atoms/icon/Icon.svelte";
    import { fade, fly } from "svelte/transition";
    import { clickOutside } from "$lib/utils/click-outside";

    let isOpen = $state(false);

    function toggle() {
        isOpen = !isOpen;
        if (isOpen) {
            // Maybe mark viewed? No, explicit action usually
        }
    }

    function close() {
        isOpen = false;
    }

    function formatTime(date: Date) {
        const now = new Date();
        const diff = Math.floor(
            (now.getTime() - new Date(date).getTime()) / 60000,
        ); // minutes
        if (diff < 1) return "Justo ahora";
        if (diff < 60) return `Hace ${diff}m`;
        const hours = Math.floor(diff / 60);
        if (hours < 24) return `Hace ${hours}h`;
        return new Date(date).toLocaleDateString();
    }
</script>

<div class="relative z-50" use:clickOutside={close}>
    <button
        onclick={toggle}
        class="relative p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-100"
        aria-label="Ver notificaciones"
    >
        <Icon name="Bell" size={20} />

        {#if notificationState.unreadCount > 0}
            <span
                class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"
            ></span>
        {/if}
    </button>

    {#if isOpen}
        <div
            transition:fly={{ y: 10, duration: 200 }}
            class="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-xl shadow-xl ring-1 ring-black/5 flex flex-col max-h-[80vh] overflow-hidden origin-top-right border border-gray-100"
        >
            <div
                class="p-4 border-b flex items-center justify-between bg-gray-50/50"
            >
                <h3 class="font-semibold text-gray-900">Notificaciones</h3>
                {#if notificationState.unreadCount > 0}
                    <button
                        onclick={() => notificationService.markAllAsRead()}
                        class="text-xs text-primary-600 hover:text-primary-700 font-medium cursor-pointer"
                    >
                        Marcar todo como leído
                    </button>
                {/if}
            </div>

            <div class="overflow-y-auto flex-1">
                {#if notificationState.history.length === 0}
                    <div
                        class="flex flex-col items-center justify-center p-8 text-center text-gray-500"
                    >
                        <Icon
                            name="BellOff"
                            size={32}
                            className="mb-2 opacity-20"
                        />
                        <p class="text-sm">No tienes notificaciones</p>
                    </div>
                {/if}

                {#each notificationState.history as notification (notification.id)}
                    <div
                        class="block w-full text-left p-4 border-b last:border-0 hover:bg-gray-50 transition-colors relative group {notification.read
                            ? 'bg-white'
                            : 'bg-blue-50/30'}"
                    >
                        <div class="flex gap-3">
                            <div class="mt-0.5 shrink-0">
                                {#if notification.type === "success"}
                                    <div
                                        class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600"
                                    >
                                        <Icon name="Check" size={14} />
                                    </div>
                                {:else if notification.type === "error"}
                                    <div
                                        class="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600"
                                    >
                                        <Icon name="X" size={14} />
                                    </div>
                                {:else if notification.type === "warning"}
                                    <div
                                        class="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600"
                                    >
                                        <Icon name="AlertTriangle" size={14} />
                                    </div>
                                {:else}
                                    <div
                                        class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"
                                    >
                                        <Icon name="Info" size={14} />
                                    </div>
                                {/if}
                            </div>

                            <div class="flex-1 space-y-1">
                                <div class="flex justify-between items-start">
                                    <p
                                        class="text-sm font-medium text-gray-900 leading-none"
                                    >
                                        {notification.title || "Notificación"}
                                    </p>
                                    <span
                                        class="text-[10px] text-gray-400 whitespace-nowrap ml-2"
                                    >
                                        {formatTime(notification.timestamp)}
                                    </span>
                                </div>
                                <p
                                    class="text-sm text-gray-500 line-clamp-2 leading-snug"
                                >
                                    {notification.message}
                                </p>
                            </div>

                            {#if !notification.read}
                                <div class="shrink-0 self-center">
                                    <button
                                        onclick={() =>
                                            notificationService.markAsRead(
                                                notification.id,
                                            )}
                                        class="w-2 h-2 bg-primary-500 rounded-full hover:scale-150 transition-transform cursor-pointer"
                                        title="Marcar como leída"
                                    ></button>
                                </div>
                            {/if}
                        </div>
                    </div>
                {/each}
            </div>

            <div class="p-2 border-t bg-gray-50 text-center">
                <!-- Optional 'View All' link -->
            </div>
        </div>
    {/if}
</div>
