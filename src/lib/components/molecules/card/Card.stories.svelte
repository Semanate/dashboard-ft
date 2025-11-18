<script module>
  import { defineMeta } from "@storybook/addon-svelte-csf";

  import Card from "$lib/components/molecules/card/Card.svelte";

  export const stories = [
    {
      title: "Default Card",
      component: Card,
      props: {
        title: "Card Title",
        content: "This is a sample content for the card component.",
      },
    },
    {
      title: "Another Card",
      component: Card,
      props: {
        title: "Another Card Title",
        content: "Here is some different content for another card.",
      },
    },
  ];

  const { Story } = defineMeta({
    title: "Example/Card",
    component: Card,
    tags: ["autodocs"],
    args: {
      title: "Card Title",
      content: "This is a sample content for the card component.",
    },
  });
</script>

<Story
  name="Default Card"
  args={{
    title: "Card Title",
    content: "This is a sample content for the card component.",
  }}
/>
