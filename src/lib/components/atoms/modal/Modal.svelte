<script lang="ts">
    import Icon from "../icon/Icon.svelte";

    interface Props {
        isOpen: boolean;
        title: string;
        size?: 'sm' | 'md' | 'lg' | 'xl';
        onClose: () => void;
        children?: any;
        footer?: any;
    }

    const {
        isOpen,
        title,
        size = 'md',
        onClose,
        children,
        footer
    }: Props = $props();

    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl'
    };

    function handleBackdropClick(event: MouseEvent) {
        if (event.target === event.currentTarget) {
            onClose();
        }
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === 'Escape') {
            onClose();
        }
    }
</script>

{#if isOpen}
    <div
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onclick={handleBackdropClick}
        onkeydown={handleKeydown}
        role="dialog"
        aria-modal="true"
        tabindex="-1"
    >
        <div class="bg-white rounded-xl shadow-2xl w-full {sizeClasses[size]} max-h-[90vh] flex flex-col">
            <!-- Header -->
            <div class="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 class="text-xl font-semibold text-gray-900">{title}</h3>
                <button
                    type="button"
                    onclick={onClose}
                    class="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
                    aria-label="Cerrar"
                >
                    <Icon name="X" size={20} />
                </button>
            </div>

            <!-- Body -->
            <div class="p-6 overflow-y-auto flex-1">
                {#if children}
                    {@render children()}
                {/if}
            </div>

            <!-- Footer -->
            {#if footer}
                <div class="p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                    {@render footer()}
                </div>
            {/if}
        </div>
    </div>
{/if}
