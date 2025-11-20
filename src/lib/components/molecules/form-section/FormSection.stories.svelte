<script module>
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { fn } from "storybook/test";
  import FormSection from "./FormSection.svelte";

  // More on how to set up stories at: https://storybook.js.org/docs/writing-stories
  const { Story } = defineMeta({
    title: "Molecules/FormSection",
    component: FormSection,
    tags: ["autodocs"],
    args: {
      title: "User Information",
      fields: [
        {
          type: "text",
          label: "First Name",
          placeholder: "Enter your first name",
          value: "",
          onChange: fn(),
        },
        {
          type: "text",
          label: "Last Name",
          placeholder: "Enter your last name",
          value: "",
          onChange: fn(),
        },
        {
          type: "select",
          label: "Country",
          options: [
            { label: "United States", value: "us" },
            { label: "Canada", value: "ca" },
            { label: "Mexico", value: "mx" },
          ],
          value: "",
          onChange: fn(),
        },
      ],
    },
  });
</script>

<Story
  name="Basic Form Section"
  args={{
    title: "User Information",
    fields: [
      {
        type: "text",
        label: "First Name",
        placeholder: "Enter your first name",
        value: "",
        onChange: fn(),
      },
      {
        type: "text",
        label: "Last Name",
        placeholder: "Enter your last name",
        value: "",
        onChange: fn(),
      },
      {
        type: "select",
        label: "Country",
        options: [
          { label: "United States", value: "us" },
          { label: "Canada", value: "ca" },
          { label: "Mexico", value: "mx" },
        ],
        value: "",
        onChange: fn(),
      },
    ],
  }}
/>
<Story
  name="Form Section Without Title"
  args={{
    fields: [
      {
        type: "text",
        label: "Email",
        placeholder: "Enter your email",
        value: "",
        onChange: fn(),
      },
      {
        type: "date",
        label: "Date of Birth",
        value: "",
        onChange: fn(),
      },
    ],
  }}
/>

<Story
  name="Form Section With Errors"
  args={{
    title: "Account Details",
    fields: [
      {
        type: "text",
        label: "Username",
        placeholder: "Choose a username",
        error: "Username is already taken",
        value: "",
        onChange: fn(),
      },
      {
        type: "text",
        label: "Password",
        placeholder: "Enter your password",
        error: "Password must be at least 8 characters",
        value: "",
        onChange: fn(),
      },
    ],
  }}
/>
<Story
  name="Mixed Field Types"
  args={{
    title: "Profile Setup",
    fields: [
      {
        type: "text",
        label: "Full Name",
        placeholder: "Enter your full name",
        value: "",
        onChange: fn(),
      },
      {
        type: "select",
        label: "Favorite Color",
        options: [
          { label: "Red", value: "red" },
          { label: "Green", value: "green" },
          { label: "Blue", value: "blue" },
        ],
        value: "",
        onChange: fn(),
      },
    ],
  }}
/>

<!-- Multiples Inputs with file and date y more -->
<Story
  name="Extended Form Section"
  args={{
    title: "Extended User Information",
    fields: [
      {
        type: "text",
        label: "Address",
        placeholder: "Enter your address",
        value: "",
        onChange: fn(),
      },
      {
        type: "date",
        label: "Appointment Date",
        value: "",
        onChange: fn(),
      },
      {
        type: "select",
        label: "Subscription Plan",
        options: [
          { label: "Free", value: "free" },
          { label: "Basic", value: "basic" },
          { label: "Premium", value: "premium" },
        ],
        value: "",
        onChange: fn(),
      },
      {
        type: "file",
        label: "Profile Picture",
        value: null,
        onChange: fn(),
      },
      {
        type: "textarea",
        label: "Bio",
        placeholder: "Tell us about yourself",
        value: "",
        onChange: fn(),
      },
    ],
  }}
/>
