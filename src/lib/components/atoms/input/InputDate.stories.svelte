<script module>
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import InputDate from "./InputDate.svelte";
  import { fn } from "storybook/test";

  // More on how to set up stories at: https://storybook.js.org/docs/writing-stories
  const { Story } = defineMeta({
    title: "Atoms/InputDate",
    component: InputDate,
    tags: ["autodocs"],
    argTypes: {
      variant: {
        control: { type: "select" },
        options: ["default", "filled", "outline", "unstyled"],
      },
      size: {
        control: { type: "select" },
        options: ["small", "medium", "large"],
      },
    },
    args: {
      onchange: fn(),
    },
  });
</script>

<!-- More on writing stories with args: https://storybook.js.org/docs/writing-stories/args -->
<Story
  name="Default Date Input"
  args={{ label: "Select Date", placeholder: "YYYY-MM-DD" }}
/>
<Story
  name="Large Date Input"
  args={{
    label: "Event Date",
    placeholder: "YYYY-MM-DD",
    size: "large",
  }}
/>
<Story
  name="With Error"
  args={{
    label: "Birth Date",
    placeholder: "YYYY-MM-DD",
    error: "Invalid date format",
    size: "small",
  }}
/>
