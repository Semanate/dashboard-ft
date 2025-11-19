<script module>
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import UserInfo from "./UserInfo.svelte";

  // More on how to set up stories at: https://storybook.js.org/docs/writing-stories
  const { Story } = defineMeta({
    title: "Molecules/UserInfo",
    component: UserInfo,
    tags: ["autodocs"],
    args: {
      name: "Jane Smith",
      email: "jane.smith@example.com",
    },
  });
</script>

<Story
  name="Default UserInfo"
  args={{ name: "Jane Smith", email: "jane.smith@example.com" }}
/>
<Story
  name="Another User"
  args={{ name: "John Doe", email: "john.doe@example.com" }}
/>
<Story name="No Email" args={{ name: "Jane Smith", email: "" }} />
