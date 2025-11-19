<script module>
  import { defineMeta } from "@storybook/addon-svelte-csf";

  import Tooltip from "./Tooltip.svelte";
  import Button from "../button/Button.svelte";
  // More on how to set up stories at: https://storybook.js.org/docs/writing-stories
  const { Story } = defineMeta({
    title: "Atoms/Tooltip",
    component: Tooltip,
    tags: ["autodocs"],
    args: {
      content: "This is a tooltip",
      position: "top",
      showDelay: 150,
    },
  });
</script>

<Story
  name="Positioned Tooltip"
  args={{ content: "Tooltip on the right", position: "right", showDelay: 150 }}
>
  <Button label="Hover me" variant="primary" />
</Story>
