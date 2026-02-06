<script module>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import NotificationBell from "./NotificationBell.svelte";
    import { notificationState } from "$lib/stores/notifications.svelte";

    const { Story } = defineMeta({
        title: "Molecules/NotificationBell",
        component: NotificationBell,
        parameters: {
            layout: "centered",
            docs: {
                description: {
                    component:
                        "The notification bell icon that toggles the notifications history dropdown.",
                },
            },
        },
    });
</script>

<Story name="Empty">
    {#snippet children()}
        {#each [1] as _}
            <div hidden>{notificationState.clearHistory()}</div>
        {/each}
        <div class="p-12 flex justify-center bg-gray-50">
            <NotificationBell />
        </div>
    {/snippet}
</Story>

<Story name="With Notifications">
    {#snippet children()}
        <div class="hidden">
            {notificationState.setHistory([
                {
                    id: "1",
                    type: "warning",
                    title: "Review Required",
                    message: "Compliance form #1234 needs approval.",
                    status: "pending",
                    read: false,
                    timestamp: new Date(Date.now() - 1000 * 60 * 5),
                },
                {
                    id: "2",
                    type: "success",
                    title: "Approved",
                    message: "Standard form approved automatically.",
                    status: "pending",
                    read: false,
                    timestamp: new Date(Date.now() - 1000 * 60 * 60),
                },
            ])}
        </div>
        <div class="p-12 flex justify-center bg-gray-50 h-[400px]">
            <NotificationBell />
        </div>
        <p class="text-center text-sm text-gray-500 mt-4">
            Click bell to see dropdown
        </p>
    {/snippet}
</Story>

<Story name="All Read">
    {#snippet children()}
        <div class="hidden">
            {notificationState.setHistory([
                {
                    id: "3",
                    type: "info",
                    message: "System maintenance completed.",
                    status: "read",
                    read: true,
                    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
                },
            ])}
        </div>
        <div class="p-12 flex justify-center bg-gray-50 h-[400px]">
            <NotificationBell />
        </div>
    {/snippet}
</Story>
