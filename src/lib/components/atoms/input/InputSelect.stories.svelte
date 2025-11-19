<script module>
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { fn } from "storybook/test";
  import InputSelect from "./InputSelect.svelte";

  // More on how to set up stories at: https://storybook.js.org/docs/writing-stories
  const { Story } = defineMeta({
    title: "Atoms/InputSelect",
    component: InputSelect,
    tags: ["autodocs"],
    args: {
      label: "Label",
      placeholder: "Enter text",
      variant: {
        options: [
          "default",
          "primary",
          "secondary",
          "danger",
          "success",
          "warning",
          "outline",
          "ghost",
        ],
        control: { type: "select" },
      },
      error: "",
      size: {
        options: ["small", "medium", "large"],
      },
      onInput: fn(),
    },
  });
</script>

<Story
  name="Large Input Select"
  args={{
    options: [
      { label: "Option 1", value: 1 },
      { label: "Option 2", value: 2 },
    ],
  }}
/>
