<script lang="ts">
  interface Props {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
    onConfirm: () => void;
    onCancel: () => void;
  }

  const {
    isOpen,
    title,
    message,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    variant = 'danger',
    onConfirm,
    onCancel
  }: Props = $props();

  const variantStyles = {
    danger: {
      icon: '🗑️',
      confirmBtn: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
      iconBg: 'bg-red-100'
    },
    warning: {
      icon: '⚠️',
      confirmBtn: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
      iconBg: 'bg-yellow-100'
    },
    info: {
      icon: 'ℹ️',
      confirmBtn: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
      iconBg: 'bg-blue-100'
    }
  };

  function handleBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      onCancel();
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      onCancel();
    }
  }
</script>

{#if isOpen}
  <div 
    class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    onclick={handleBackdropClick}
    onkeydown={handleKeydown}
    role="dialog"
    aria-modal="true"
    tabindex="-1"
  >
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
      <div class="mt-3 text-center">
        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full {variantStyles[variant].iconBg}">
          <span class="text-2xl">{variantStyles[variant].icon}</span>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mt-4">{title}</h3>
        <div class="mt-2 px-7 py-3">
          <p class="text-sm text-gray-500">{message}</p>
        </div>
        <div class="flex justify-center space-x-4 mt-4">
          <button
            type="button"
            class="px-4 py-2 bg-gray-300 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
            onclick={onCancel}
          >
            {cancelText}
          </button>
          <button
            type="button"
            class="px-4 py-2 {variantStyles[variant].confirmBtn} text-white text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors"
            onclick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}