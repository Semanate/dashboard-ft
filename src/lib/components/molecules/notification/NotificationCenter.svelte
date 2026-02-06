<script lang="ts">
    import { notificationState } from "$lib/stores/notifications.svelte";
    import NotificationItem from "./NotificationItem.svelte";
</script>

<div
    class="fixed z-[100] top-0 right-0 flex w-full flex-col gap-4 p-4 sm:max-w-[420px] pointer-events-none"
>
    {#each notificationState.toasts as notification (notification.id)}
        <NotificationItem {notification} />
    {/each}
</div>
