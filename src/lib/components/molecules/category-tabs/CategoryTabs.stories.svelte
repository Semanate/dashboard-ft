<script module>
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { fn } from "storybook/test";
  import CategoryTabs from "./CategoryTabs.svelte";

  const { Story } = defineMeta({
    title: "Molecules/CategoryTabs",
    component: CategoryTabs,
    tags: ["autodocs"],
    args: {
      categories: [
        { label: "Home", id: "home" },
        { label: "Profile", id: "profile" },
        { label: "Settings", id: "settings" },
      ],
      onSelect: fn(),
    },
  });
</script>

<Story
  name="Default Category Tabs"
  args={{
    categories: [
      { label: "Home", id: "home" },
      { label: "Profile", id: "profile" },
      { label: "Settings", id: "settings" },
    ],
  }}
/>

<Story
  name="Many Categories"
  args={{
    categories: [
      { label: "Home", id: "home" },
      { label: "Profile", id: "profile" },
      { label: "Settings", id: "settings" },
      { label: "Messages", id: "messages" },
      { label: "Notifications", id: "notifications" },
      { label: "Help", id: "help" },
    ],
  }}
/>
