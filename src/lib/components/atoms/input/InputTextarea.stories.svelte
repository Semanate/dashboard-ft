<script module>
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { fn } from "storybook/test";
  import InputTextarea from "./InputTextarea.svelte";

  // More on how to set up stories at: https://storybook.js.org/docs/writing-stories
  const { Story } = defineMeta({
    title: "Example/InputTextarea",
    component: InputTextarea,
    tags: ["autodocs"],
    args: {
      label: "Label",
      disabled: false,
      variant: {
        control: { type: "select" },
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
      },
      size: {
        control: { type: "select" },
        options: ["small", "medium", "large"],
      },
      error: "",
      onChange: fn(),
    },
  });
</script>

<Story
  name="Default Textarea"
  args={{ label: "Description", placeholder: "Enter your text here..." }}
/>

<Story
  name="Large Textarea"
  args={{
    label: "Comments",
    placeholder: "Enter your comments here...",
    size: "large",
  }}
/>

<Story
  name="With Error"
  args={{
    label: "Feedback",
    placeholder: "Enter your feedback here...",
    error: "This field is required",
    size: "small",
  }}
/>
