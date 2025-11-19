<script module>
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import MenuItem from "./MenuItem.svelte";

  // More on how to set up stories at: https://storybook.js.org/docs/writing-stories
  const { Story } = defineMeta({
    title: "Molecules/MenuItem",
    component: MenuItem,
    tags: ["autodocs"],
    args: {
      label: "Menu Item",
      href: "#",
      disabled: false,
      active: false,
    },
  });
</script>

<Story name="Default MenuItem" args={{ label: "Menu Item" }} />
<Story name="With Icon" args={{ label: "Menu Item", icon: "Activity" }} />
<Story name="Active MenuItem" args={{ label: "Menu Item", active: true }} />
<Story name="Disabled MenuItem" args={{ label: "Menu Item", disabled: true }} />
<Story
  name="With Icon and Active"
  args={{ label: "Menu Item", icon: "Activity", active: true }}
/>
