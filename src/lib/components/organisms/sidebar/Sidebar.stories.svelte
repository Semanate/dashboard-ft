<script module>
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import Sidebar from "./Sidebar.svelte";

  // More on how to set up stories at: https://storybook.js.org/docs/writing-stories
  const { Story } = defineMeta({
    title: "Organisms/Sidebar",
    component: Sidebar,
    tags: ["autodocs"],
    args: {
      collapsed: true,
      menu: [
        { label: "Dashboard", href: "/dashboard", icon: "Activity" },
        { label: "Settings", href: "/settings", icon: "Settings" },
      ],
    },
  });
</script>

<Story name="Default Sidebar" args={{ collapsed: false }} />
