<script lang="ts">
  import FormSection from "$lib/components/molecules/form-section/FormSection.svelte";
  interface Props {
    schema: {
      sections: Array<{
        title?: string;
        fields: Array<{
          type: "text" | "select" | "date" | "file" | "textarea";
          label: string;
          placeholder?: string;
          options?: Array<{ label: string; value: any }>;
          error?: string;
          value: any;
          onChange: (value: any) => void;
        }>;
      }>;
    };
  }

  const { schema }: Props = $props();
</script>

<div class="space-y-10">
  {#each schema.sections as section}
    <FormSection title={section.title} fields={section.fields} />
  {/each}
</div>
