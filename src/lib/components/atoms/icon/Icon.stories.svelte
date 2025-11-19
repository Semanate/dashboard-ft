<script module>
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import Icon from "./Icon.svelte";

  // More on how to set up stories at: https://storybook.js.org/docs/writing-stories
  const { Story } = defineMeta({
    title: "Atoms/Icon",
    component: Icon,
    tags: ["autodocs"],
    args: {
      name: "Activity",
      size: 24,
      className: "",
    },
  });
</script>

<!-- More on writing stories with args: https://storybook.js.org/docs/writing-stories/args -->
<Story name="Default Icon" args={{ name: "Activity" }} />
<Story name="Large Icon" args={{ name: "Bell", size: 48 }} />

<Story
  name="With Custom Class"
  args={{ name: "Check", className: "text-green-500" }}
/>
