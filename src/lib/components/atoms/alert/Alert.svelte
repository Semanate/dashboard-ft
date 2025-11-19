<script lang="ts">
  interface AlertProps {
    type: "success" | "error" | "info" | "warning";
    message: string;
  }

  const { type = "info", message = "" }: AlertProps = $props();
</script>

<div
  class="p-4 rounded-md {type === 'success'
    ? 'bg-green-100 text-green-800'
    : type === 'error'
      ? 'bg-red-100 text-red-800'
      : type === 'info'
        ? 'bg-blue-100 text-blue-800'
        : 'bg-yellow-100 text-yellow-800'}"
>
  <span>{message}</span>
</div>
