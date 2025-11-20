<script module>
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import StepperForm from "./StepperForm.svelte";

  const { Story } = defineMeta({
    title: "Organisms/StepperForm",
    component: StepperForm,
    tags: ["autodocs"],
    args: {
      categories: [
        {
          label: "Personal Info",
          fields: [
            {
              name: "firstName",
              type: "text",
              label: "First Name",
              placeholder: "Enter your first name",
              value: "",
            },
            {
              name: "lastName",
              type: "text",
              label: "Last Name",
              placeholder: "Enter your last name",
              value: "",
            },
          ],
        },
        {
          label: "Account Details",
          fields: [
            {
              name: "email",
              type: "text",
              label: "Email",
              placeholder: "Enter your email",
              value: "",
            },
            {
              name: "password",
              type: "text",
              label: "Password",
              placeholder: "Enter your password",
              value: "",
            },
          ],
        },
      ],
    },
  });
</script>

<Story
  name="Basic Stepper Form"
  args={{
    categories: [
      {
        label: "Personal Info",
        fields: [
          {
            name: "firstName",
            type: "text",
            label: "First Name",
            placeholder: "Enter your first name",
            value: "",
          },
          {
            name: "lastName",
            type: "text",
            label: "Last Name",
            placeholder: "Enter your last name",
            value: "",
          },
        ],
      },
      {
        label: "Account Details",
        fields: [
          {
            name: "email",
            type: "text",
            label: "Email",
            placeholder: "Enter your email",
            value: "",
          },
          {
            name: "password",
            type: "text",
            label: "Password",
            placeholder: "Enter your password",
            value: "",
          },
        ],
      },
    ],
  }}
/>
