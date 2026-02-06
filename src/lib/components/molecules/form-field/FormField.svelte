<script lang="ts">
  import InputText from "$lib/components/atoms/input/InputText.svelte";
  import InputSelect from "$lib/components/atoms/input/InputSelect.svelte";
  import InputDate from "$lib/components/atoms/input/InputDate.svelte";
  import InputFile from "$lib/components/atoms/input/InputFile.svelte";
  import InputTextarea from "$lib/components/atoms/input/InputTextarea.svelte";
  import type { OptionsSelects } from "$lib/types";
  import InputCheck from "$lib/components/atoms/input/InputCheck.svelte";
  import InputSignature from "$lib/components/atoms/input/InputSignature.svelte";
  import PrivacyConsent from "../privacy-consent/PrivacyConsent.svelte";
  interface Field {
    id: string;
    type:
      | "text"
      | "select"
      | "date"
      | "email"
      | "file"
      | "textarea"
      | "number"
      | "checkbox"
      | "signature"
      | "password"
      | "privacy";
    label: string;
    required?: boolean;
    placeholder?: string;
    options?: Array<OptionsSelects<any>>;
    error?: string;
    value: any;
    content: string;
    onchange?: (value: any) => void;
    min?: string | number;
    max?: string | number;
  }

  interface Props {
    field: Field;
  }
  const { field }: Props = $props();
</script>

<div class="w-full">
  {#if field.type === "select" && Object.values(field.options ?? {}).length > 0}
    <InputSelect {...field} />
  {:else if field.type === "text" || field.type === "password" || field.type === "email" || field.type === "number"}
    <InputText {...field as any} />
  {:else if field.type === "checkbox"}
    <InputCheck {...field} />
  {:else if field.type === "date"}
    <InputDate {...field} />
  {:else if field.type === "file"}
    <InputFile {...field} />
  {:else if field.type === "textarea"}
    <InputTextarea {...field} />
  {:else if field.type === "signature"}
    <InputSignature {...field} />
  {:else if field.type === "privacy"}
    <PrivacyConsent
      title={field.label}
      value={field.value}
      error={field.error}
      content={field.content}
      onChange={field.onchange}
    />
  {:else}
    <div class="text-red-500 text-sm">
      Field type "{field.type}" not supported
    </div>
  {/if}
</div>
