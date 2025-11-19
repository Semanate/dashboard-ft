<script module>
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { fn } from "storybook/test";
  import InputText from "./InputText.svelte";

  // More on how to set up stories at: https://storybook.js.org/docs/writing-stories
  const { Story } = defineMeta({
    title: "Atoms/InputText",
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
  name="Default Input"
  args={{ label: "Username", placeholder: "Enter your username" }}
/>

<Story
  name="Large Input"
  args={{
    label: "Full Name",
    placeholder: "Enter your full name",
    size: "large",
  }}
/>

<Story
  name="With Error"
  args={{
    label: "Email",
    placeholder: "Enter your email",
    error: "Invalid email address",
    size: "small",
  }}
/>
