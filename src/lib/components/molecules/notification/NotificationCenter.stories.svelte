<script module>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import NotificationCenter from "./NotificationCenter.svelte";
    import { notificationState } from "$lib/stores/notifications.svelte";

    const { Story } = defineMeta({
        title: "Molecules/NotificationCenter",
        component: NotificationCenter,
        parameters: {
            layout: "fullscreen",
            docs: {
                description: {
                    component:
                        "A global notification container anchored to the top-right of the viewport. It subscribes to the `notificationState` store.",
                },
            },
        },
    });
</script>

<Story name="Empty State">
    <div
        class="h-[300px] w-full bg-gray-50 p-8 border relative flex flex-col items-center justify-center"
    >
        <p class="text-sm text-gray-500 mb-2">
            The notification center is mounted at top-right, but currently
            empty.
        </p>
        <p class="text-xs text-gray-400">
            Use the other stories to see notifications in action.
        </p>
        <NotificationCenter />
    </div>
</Story>

<Story name="Multiple Notifications">
    {#snippet children()}
        <div class="h-[500px] w-full bg-slate-50 p-8 border relative">
            <div class="flex flex-col gap-4 items-start">
                <h3 class="font-bold text-gray-800">Interactive Demo</h3>
                <p class="text-gray-600 max-w-md">
                    Click the button below to simulate incoming push
                    notifications. They will stack in the top-right corner.
                </p>

                <button
                    class="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg transition-all active:scale-95"
                    onclick={() => {
                        notificationState.add({
                            type: "success",
                            title: "Approved",
                            message: "Form #1029 successfully approved.",
                        });
                        setTimeout(() => {
                            notificationState.add({
                                type: "warning",
                                title: "Action Required",
                                message:
                                    "Compliance review pending for Customer A.",
                                duration: 0,
                            }); // Sticky
                        }, 500);
                        setTimeout(() => {
                            notificationState.add({
                                type: "error",
                                title: "Compliance Alert",
                                message:
                                    "Risk threshold exceeded for Transaction #999.",
                            });
                        }, 1000);
                    }}
                >
                    Simulate Batch Notifications
                </button>
            </div>
            <NotificationCenter />
        </div>
    {/snippet}
</Story>

<Story name="Normal State (Info)">
    {#snippet children()}
        <div class="h-[300px] w-full bg-gray-50 p-8 border relative">
            <button
                class="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-all active:scale-95"
                onclick={() => {
                    notificationState.add({
                        type: "info",
                        title: "System Update",
                        message:
                            "The dashboard will be under maintenance at 02:00 AM.",
                    });
                }}
            >
                Trigger Info Notification
            </button>
            <NotificationCenter />
        </div>
    {/snippet}
</Story>
