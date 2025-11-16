<script module>
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { fn } from "storybook/test";
  import CategoryForm from "./CategoryForm.svelte";

  const { Story } = defineMeta({
    title: "Example/CategoryForm",
    component: CategoryForm,
    tags: ["autodocs"],
    args: {
      categories: [
        {
          label: "Category 1",
          fields: [
            { label: "Field A", type: "text", name: "fieldA" },
            { label: "Field B", type: "textarea", name: "fieldB" },
          ],
        },
        {
          label: "Category 2",
          fields: [
            { label: "Field C", type: "text", name: "fieldC" },
            { label: "Field D", type: "date", name: "fieldD" },
          ],
        },
      ],
      onSubmit: fn(),
    },
  });
</script>

<Story
  name="Two Categories Form"
  args={{
    categories: [
      {
        label: "Category 1",
        fields: [
          { label: "Field A", type: "text", name: "fieldA" },
          { label: "Field B", type: "textarea", name: "fieldB" },
        ],
      },
      {
        label: "Category 2",
        fields: [
          { label: "Field C", type: "text", name: "fieldC" },
          { label: "Field D", type: "date", name: "fieldD" },
        ],
      },
    ],
    onSubmit: fn(),
  }}
/>
