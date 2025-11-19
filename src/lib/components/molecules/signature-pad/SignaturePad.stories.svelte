<script module>
  import SignaturePad from "./SignaturePad.svelte";
  import { defineMeta } from "@storybook/addon-svelte-csf";
  // More on how to set up stories at: https://storybook.js.org/docs/writing-stories
  const { Story } = defineMeta({
    title: "Molecules/SignaturePad",
    component: SignaturePad,
    tags: ["autodocs"],
    args: {
      width: 500,
      height: 200,
      penColor: "#000000",
      backgroundColor: "#ffffff",
    },
  });
</script>

<Story
  name="Default SignaturePad"
  args={{
    width: 500,
    height: 200,
    penColor: "#000000",
    backgroundColor: "#ffffff",
  }}
/>

<Story
  name="Large SignaturePad"
  args={{
    width: 800,
    height: 400,
    penColor: "#000000",
    backgroundColor: "#ffffff",
  }}
/>
<Story
  name="Colored Pen"
  args={{
    width: 500,
    height: 200,
    penColor: "#ff0000",
    backgroundColor: "#ffffff",
  }}
/>

<Story
  name="Colored Background"
  args={{
    width: 500,
    height: 200,
    penColor: "#000000",
    backgroundColor: "#ff0000",
  }}
/>
