<script module>
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { fn } from "storybook/test";
  import ButtonWithLoading from "./ButtonWithLoading.svelte";

  // More on how to set up stories at: https://storybook.js.org/docs/writing-stories
  const { Story } = defineMeta({
    title: "Example/ButtonWithLoading",
    component: ButtonWithLoading,
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
    },
    args: {
      onclick: fn(),
    },
  });
</script>

<!-- More on writing stories with args: https://storybook.js.org/docs/writing-stories/args -->
<Story
  name="Primary"
  args={{ variant: "primary", label: "Button", loading: false }}
/>
<Story
  name="Secondary"
  args={{ variant: "secondary", label: "Button", loading: false }}
/>

<Story name="Large" args={{ size: "large", label: "Button", loading: false }} />

<Story name="Small" args={{ size: "small", label: "Button", loading: false }} />
<Story
  name="Loading State"
  args={{ variant: "primary", label: "Loading...", loading: true }}
/>
