<script module>
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import Alert from "./Alert.svelte";
  const { Story } = defineMeta({
    title: "Atoms/Alert",
    component: Alert,
    args: {
      type: "info",
      message: "This is an alert message.",
    },
  });
</script>

<Story name="Success Alert" args={{ type: "success", message: "Operation completed successfully!" }} />
<Story name="Error Alert" args={{ type: "error", message: "An error occurred during the operation." }} />
<Story name="Info Alert" args={{ type: "info", message: "This is some important information." }} />
<Story name="Warning Alert" args={{ type: "warning", message: "This is a warning message." }} />