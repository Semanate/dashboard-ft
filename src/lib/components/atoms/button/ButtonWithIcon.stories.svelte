<script module>
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { fn } from "storybook/test";
  import ButtonWithIcon from "./ButtonWithIcon.svelte";

  // More on how to set up stories at: https://storybook.js.org/docs/writing-stories
  const { Story } = defineMeta({
    title: "Atoms/ButtonWithIcon",
    component: ButtonWithIcon,
    tags: ["autodocs"],
    argTypes: {
      variant: {
        control: { type: "select" },
        options: ["primary", "secondary", "tertiary", "default"],
      },
      size: {
        control: { type: "select" },
        options: ["small", "medium", "large"],
      },
      iconButton: {
        control: { type: "text" },
      },
      label: {
        control: { type: "text" },
      },
    },
    args: {
      onclick: fn(),
      iconButton: "star",
      label: "Button",
    },
  });
</script>

<!-- More on writing stories with args: https://storybook.js.org/docs/writing-stories/args -->
<Story
  name="Primary with Icon"
  args={{ variant: "primary", iconButton: "star", label: "Button" }}
/>
<Story
  name="Secondary with Icon"
  args={{ variant: "secondary", iconButton: "heart", label: "Button" }}
/>
<Story
  name="Large with Icon"
  args={{ size: "large", iconButton: "thumbs-up", label: "Button" }}
/>
