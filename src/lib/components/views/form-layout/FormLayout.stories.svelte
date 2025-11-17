<script module>
// @ts-nocheck

  import FormLayout from "./FormLayout.svelte";
  //   import ButtonWithLoading from "$lib/components/atoms/button/ButtonWithLoading.svelte";
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import CategoryForm from "$lib/components/organisms/category-form/CategoryForm.svelte";

  let categories = [
    {
      label: "Information Technology",
      fields: [
        {
          name: "Job Title",
          type: "text",
          placeholder: "Enter your job title",
          value: "",
        },
        {
          name: "Experience Level",
          type: "select",
          options: [
            { label: "Junior", value: "junior" },
            { label: "Mid", value: "mid" },
            { label: "Senior", value: "senior" },
          ],
          value: "mid",
        },
        {
          name: "Remote Work Preference",
          type: "select",
          options: [
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ],
          value: "yes",
        },
      ],
    },
    {
      label: "Human Resources",
      fields: [
        {
          name: "Department",
          type: "select",
          options: [
            { label: "Recruitment", value: "recruitment" },
            { label: "Employee Relations", value: "employee_relations" },
            {
              label: "Training and Development",
              value: "training_development",
            },
          ],
          value: "recruitment",
        },
        {
          name: "Years of Experience",
          type: "text",
          placeholder: "Enter years of experience",
          value: "",
        },
      ],
    },
    {
      label: "Marketing",
      fields: [
        {
          name: "Specialization",
          type: "select",
          options: [
            { label: "Digital Marketing", value: "digital" },
            { label: "Content Marketing", value: "content" },
            { label: "SEO", value: "seo" },
          ],
          value: "digital",
        },
        {
          name: "Portfolio URL",
          type: "text",
          placeholder: "Enter your portfolio URL",
          value: "",
        },
      ],
    },
  ];

  const { Story } = defineMeta({
    title: "Example/FormLayout",
    component: FormLayout,
    tags: ["autodocs"],
    args: {
      categories,
      title: "Job Application Form",
      description: "Please fill out the form below to apply for the job.",
      width: "max-w-3xl",
    },
  });
</script>

<Story name="Job Application Form">
  {#snippet template(args)}
    <CategoryForm {...args}/>
  {/snippet}
</Story>
