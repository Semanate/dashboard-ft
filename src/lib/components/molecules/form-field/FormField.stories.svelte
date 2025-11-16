<script module>
  import { defineMeta } from "@storybook/addon-svelte-csf";

  import FormField from "./FormField.svelte";

  const { Story } = defineMeta({
    title: "Example/FormField",
    component: FormField,
    tags: ["autodocs"],
    args: {
      field: {
        type: "text",
        label: "Label",
        placeholder: "Placeholder",
        value: "",
        onChange: (value) => {},
      },
    },
  });
</script>

<Story
  name="Text Input Field"
  args={{
    field: {
      type: "text",
      label: "Username",
      placeholder: "Enter your username",
      value: "",
      onChange: (value) => console.log("Username changed to:", value),
    },
  }}
/>

<Story
  name="Select Input Field"
  args={{
    field: {
      type: "select",
      label: "Country",
      options: [
        { label: "United States", value: "us" },
        { label: "Canada", value: "ca" },
        { label: "Mexico", value: "mx" },
      ],
      value: "us",
      onChange: (value) => console.log("Country selected:", value),
    },
  }}
/>
<Story
  name="With Error"
  args={{
    field: {
      type: "text",
      label: "Email",
      placeholder: "Enter your email",
      value: "",
      error: "Invalid email address",
      onChange: (value) => console.log("Email changed to:", value),
    },
  }}
/>

<Story
  name="Multiple Fields"
  args={{
    field: {
      type: "text",
      label: "First Name",
      placeholder: "Enter your first name",
      value: "",
      onChange: (value) => console.log("First Name changed to:", value),
    },
  }}
/>
