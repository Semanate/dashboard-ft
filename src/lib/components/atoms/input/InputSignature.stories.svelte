<script module>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import { fn } from "storybook/test";

    import InputSignature from "./InputSignature.svelte";

    // More on how to set up stories at: https://storybook.js.org/docs/writing-stories
    const { Story } = defineMeta({
        title: "Atoms/InputSignature",
        component: InputSignature,
        tags: ["autodocs"],
        argTypes: {
            variant: {
                control: { type: "select" },
                options: ["default"],
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
    name="Default Signature Input"
    args={{ label: "Signature", placeholder: "Sign here" }}
/>
