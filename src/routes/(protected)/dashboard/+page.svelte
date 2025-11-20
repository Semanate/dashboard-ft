<script lang="ts">
  import SignaturePad from "$lib/components/molecules/signature-pad/SignaturePad.svelte";
  import CategoryForm from "$lib/components/organisms/category-form/CategoryForm.svelte";
</script>

<section class="prose max-w-full">
  <h1>Signature Pad Component</h1>
  <p>
    This component allows users to draw their signature on a canvas. It supports
    mouse and touch inputs, and provides options to clear the canvas.
  </p>

  <CategoryForm
    categories={[
      {
        label: "Category 1",
        fields: [
          { id: "fieldA", label: "Field A", type: "text", name: "fieldA", value: "" },
          { id: "fieldB", label: "Field B", type: "textarea", name: "fieldB", value: "" },
        ],
      },
      {
        label: "Category 2",
        fields: [
          { id: "fieldC", label: "Field C", type: "text", name: "fieldC", value: "" },
          { id: "fieldD", label: "Field D", type: "date", name: "fieldD", value: "" },
        ],
      },
    ]}
  />
</section>
