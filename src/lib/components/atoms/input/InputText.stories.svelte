<script module>
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { fn } from "storybook/test";
  import InputText from "./InputText.svelte";

  // More on how to set up stories at: https://storybook.js.org/docs/writing-stories
  const { Story } = defineMeta({
    title: "Example/InputText",
    component: InputText,
    tags: ["autodocs"],
    args: {
      label: "Label",
      placeholder: "Enter text",
      error: "",
      size: {
        options: ["small", "medium", "large"],
      },
      onInput: fn(),
    },
  });
</script>

<!-- More on writing stories with args: https://storybook.js.org/docs/writing-stories/args -->
<Story
  name="Default"
  args={{ label: "Username", placeholder: "Enter your username" }}
/>
<Story
  name="With Error"
  args={{
    label: "Email",
    placeholder: "Enter your email",
    error: "Invalid email address",
  }}
/>
