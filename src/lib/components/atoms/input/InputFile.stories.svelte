<script module>
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { fn } from "storybook/test";
  import InputFile from "./InputFile.svelte";

  // More on how to set up stories at: https://storybook.js.org/docs/writing-stories
  const { Story } = defineMeta({
    title: "Atoms/InputFile",
    component: InputFile,
    tags: ["autodocs"],
    argTypes: {
      variant: {
        control: { type: "select" },
        options: ["default", "filled", "outline", "unstyled"],
      },
      size: {
        control: { type: "select" },
        options: ["small", "medium", "large"],
      },
    },
    args: {
      onchange: fn(),
    },
  });
</script>

<!-- More on writing stories with args: https://storybook.js.org/docs/writing-stories/args -->
<Story
  name="Default File Input"
  args={{ label: "Upload File", placeholder: "Choose a file..." }}
/>
<Story
  name="Large File Input"
  args={{
    label: "Upload Document",
    placeholder: "Choose a document...",
    size: "large",
  }}
/>
<Story
  name="With Error"
  args={{
    label: "Upload Image",
    placeholder: "Choose an image...",
    error: "File type not supported",
    size: "small",
  }}
/>
