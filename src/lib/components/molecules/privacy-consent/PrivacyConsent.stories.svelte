<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import PrivacyConsent from "./PrivacyConsent.svelte";

  const { Story } = defineMeta({
    title: "Molecules/PrivacyConsent",
    component: PrivacyConsent,
    tags: ["autodocs"],
    args: {
      title: "Aviso de Privacidad y Tratamiento de Datos",
      content: `
        Autorizo de manera expresa, previa e informada el tratamiento de mis
        datos personales conforme a la Ley 1581 de 2012 y demás normas
        concordantes, para las finalidades descritas en la política de
        tratamiento de datos.
      `,
      checkboxLabel: "Acepto el aviso de privacidad",
      policyUrl: "/politica-privacidad",
      policyLabel: "Ver política de privacidad",
      value: false,
      error: "",
    },
  });
</script>

<Story name="Default" />

<Story
  name="Con error"
  args={{
    value: false,
    error: "Debe aceptar el aviso de privacidad para continuar",
  }}
/>

<Story
  name="Aceptado"
  args={{
    value: true,
  }}
/>
<Story
  name="Sin enlace a política de privacidad"
  args={{
    policyUrl: undefined,
  }}
/>