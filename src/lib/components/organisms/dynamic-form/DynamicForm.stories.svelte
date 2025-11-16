<script module>
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { fn } from "storybook/test";
  import DynamicForm from "./DynamicForm.svelte";

  const { Story } = defineMeta({
    title: "Example/DynamicForm",
    component: DynamicForm,
    tags: ["autodocs"],
    args: {
      schema: {
        title: "User Registration",
        sections: [
          {
            title: "Personal Information",
            fields: [
              {
                type: "text",
                label: "First Name",
                name: "firstName",
                placeholder: "Enter your first name",
              },
              {
                type: "text",
                label: "Last Name",
                name: "lastName",
                placeholder: "Enter your last name",
              },
              {
                type: "email",
                label: "Email",
                name: "email",
                placeholder: "Enter your email",
              },
            ],
          },
          {
            title: "Account Details",
            fields: [
              {
                type: "text",
                label: "Username",
                name: "username",
                placeholder: "Choose a username",
              },
              {
                type: "password",
                label: "Password",
                name: "password",
                placeholder: "Create a password",
              },
              {
                type: "password",
                label: "Confirm Password",
                name: "confirmPassword",
                placeholder: "Confirm your password",
              },
            ],
          },
        ],
      },
      onSubmit: fn(),
    },
  });
</script>

<Story name="User Registration Form" />
<Story
  name="Simple Contact Form"
  args={{
    schema: {
      sections: [
        {
          fields: [
            {
              type: "text",
              label: "Name",
              name: "name",
              placeholder: "Enter your name",
            },
            {
              type: "email",
              label: "Email",
              name: "email",
              placeholder: "Enter your email",
            },
            {
              type: "textarea",
              label: "Message",
              name: "message",
              placeholder: "Enter your message",
            },
          ],
        },
      ],
    },
    onSubmit: fn(),
  }}
/>
<Story
  name="Form with Select and Date"
  args={{
    schema: {
      sections: [
        {
          fields: [
            {
              type: "select",
              label: "Country",
              name: "country",
              options: [
                { label: "USA", value: "usa" },
                { label: "Canada", value: "canada" },
                { label: "UK", value: "uk" },
              ],
            },
            {
              type: "date",
              label: "Date of Birth",
              name: "dob",
            },
          ],
        },
      ],
    },
    onSubmit: fn(),
  }}
/>
<Story
  name="Form with Errors"
  args={{
    schema: {
      sections: [
        {
          fields: [
            {
              type: "text",
              label: "Username",
              name: "username",
              placeholder: "Choose a username",
              error: "Username is required",
            },
            {
              type: "password",
              label: "Password",
              name: "password",
              placeholder: "Create a password",
              error: "Password must be at least 8 characters",
            },
          ],
        },
      ],
    },
    onSubmit: fn(),
  }}
/>
