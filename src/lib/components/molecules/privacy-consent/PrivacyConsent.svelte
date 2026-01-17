<script lang="ts">
  interface Props {
    title?: string;
    content: string;
    checkboxLabel?: string;
    policyUrl?: string;
    policyLabel?: string;
    value?: boolean;
    error?: string;
    onChange?: (value: boolean) => void;
  }

  const {
    title = "Aviso de Privacidad y Tratamiento de Datos",
    content,
    checkboxLabel = "Acepto el aviso de privacidad",
    policyUrl,
    policyLabel = "Ver política de privacidad",
    value = false,
    error = "",
    onChange = () => {},
  }: Props = $props();

  function toggle(e: Event) {
    onChange((e.target as HTMLInputElement).checked);
  }
  console.log(policyUrl);
</script>

<div class="w-full space-y-3 rounded-md border p-4 bg-gray-50">
  <div class="text-sm text-gray-700 leading-relaxed space-y-2">
    <p class="font-semibold">{title}</p>

    <p>{@html content}</p>

    {#if policyUrl}
      <a
        href={policyUrl}
        target="_blank"
        class="text-blue-600 underline text-sm"
      >
        {policyLabel}
      </a>
    {/if}
  </div>

  <label class="flex items-center gap-2 text-sm">
    <input
      type="checkbox"
      checked={value}
      onchange={toggle}
      class="h-4 w-4"
    />
    {checkboxLabel}
  </label>

  {#if error}
    <p class="text-red-600 text-sm">{error}</p>
  {/if}
</div>
