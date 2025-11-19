<script module>
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { fn } from "storybook/test";

  import Stepper from "./Stepper.svelte";

  // More on how to set up stories at: https://storybook.js.org/docs/writing-stories
  const { Story } = defineMeta({
    title: "Molecules/Stepper",
    component: Stepper,
    tags: ["autodocs"],
    args: {
      steps: [
        { label: "Step 1", completed: true },
        { label: "Step 2", completed: false },
        { label: "Step 3", completed: false },
      ],
      currentStep: 1,
      onStepClick: fn(),
    },
  });
</script>

<Story
  name="Three Steps Stepper With Icons"
  args={{
    steps: [
      { label: "Step 1", completed: true, icon: "House" },
      { label: "Step 2", completed: false, icon: "User" },
      { label: "Step 3", completed: false, icon: "CheckCircle" },
    ],
    currentStep: 1,
    onStepClick: fn(),
  }}
/>
<Story
  name="Five Steps Stepper"
  args={{
    steps: [
      { label: "Step 1", completed: true },
      { label: "Step 2", completed: true },
      { label: "Step 3", completed: false },
      { label: "Step 4", completed: false },
      { label: "Step 5", completed: false },
    ],
    currentStep: 3,
    onStepClick: fn(),
  }}
/>
<Story
  name="Single Step Stepper"
  args={{
    steps: [{ label: "Only Step", completed: false }],
    currentStep: 0,
    onStepClick: fn(),
  }}
/>

<Story
  name="All Steps Completed"
  args={{
    steps: [
      { label: "Step 1", completed: true },
      { label: "Step 2", completed: true },
      { label: "Step 3", completed: true },
    ],
    currentStep: 2,
    onStepClick: fn(),
  }}
/>
