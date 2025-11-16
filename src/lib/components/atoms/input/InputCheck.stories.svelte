<script module>
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { fn } from "storybook/test";
  import InputCheck from "./InputCheck.svelte";

  // More on how to set up stories at: https://storybook.js.org/docs/writing-stories
  const { Story } = defineMeta({
    title: "Example/InputCheck",
    component: InputCheck,
    tags: ["autodocs"],
    args: {
      label: "Label",
      checked: false,
      disabled: false,
      error: "",
      onChange: fn(),
    },
  });
</script>

<Story
  name="Checked Input Check"
  args={{ label: "Accept Terms", checked: true }}
/>
<Story
  name="Disabled Input Check"
  args={{ label: "Accept Terms", disabled: true }}
/>

<Story
  name="With Error"
  args={{ label: "Accept Terms", error: "You must accept the terms" }}
/>
