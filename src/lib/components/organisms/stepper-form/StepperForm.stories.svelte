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
            id: "firstName",
            name: "firstName",
            type: "text",
            required: true,
            label: "First Name",
            placeholder: "Enter your first name",
            value: "",
          },
          {
            id: "lastName",
            name: "lastName",
            type: "text",
            required: true,
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
            id: "email",
            name: "email",
            required: true,
            type: "text",
            label: "Email",
            placeholder: "Enter your email",
            value: "",
          },
          {
            id: "password",
            name: "password",
            type: "text",
            required: true,
            label: "Password",
            placeholder: "Enter your password",
            value: "",
          },
        ],
      },
    ],
  }}
/>
