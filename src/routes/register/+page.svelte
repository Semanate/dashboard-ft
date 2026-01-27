<script lang="ts">
  import { Alert, ButtonWithLoading, FormSection, Card, InputCheck } from "$lib/components";
  import IMAGE_URL from "$lib/assets/Login-cuate.svg";
  
  let { form } = $props();

  let formValues: Record<string, any> = $state({});

  function updateField(id: string, value: any) {
    formValues = {
      ...formValues,
      [id]: value,
    };
  }

  const fields = $derived([
    {
      id: "full-name",
      type: "text" as const,
      label: "Nombre Completo",
      value: formValues["full-name"] ?? "",
      onchange: (v: any) => updateField("full-name", v),
      placeholder: "Ingresa tu nombre completo",
    },
    {
      id: "email",
      type: "email" as const,
      label: "Correo",
      placeholder: "Ingresa tu correo electrónico",
      value: formValues.email ?? "",
      onchange: (v: any) => updateField("email", v),
    },
    {
      id: "password",
      type: "password" as const,
      label: "Contraseña",
      value: formValues.password ?? "",
      onchange: (v: any) => updateField("password", v),
      placeholder: "Ingresa tu contraseña",
    },

    {
      id: "confirm-password",
      type: "password" as const,
      label: "Confirmar Contraseña",
      value: formValues["confirm-password"] ?? "",
      onchange: (v: any) => updateField("confirm-password", v),
      placeholder: "Confirma tu contraseña",
    },
    {
      id: "phone",
      type: "text" as const,
      label: "Teléfono",
      value: formValues.phone ?? "",
      onchange: (v: any) => updateField("phone", v),
      placeholder: "Ingresa tu número de teléfono",
    },
  ]);
</script>

<main class="min-h-screen grid place-items-center bg-primary/30 p-6">
  <Card
    title=""
    content=""
    class="w-full max-w-4xl! bg-white shadow-2xl rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-2"
  >
    <div class="p-10 flex flex-col justify-center">
      <h1 class="text-3xl font-bold mb-2">Hola!</h1>
      <p class="text-gray-500 mb-6">Hey, Bienvenido a registrarse!</p>

      <form class="space-y-4 w-full" method="POST" action="?/register">
        <FormSection title="" {fields} />
        {#each Object.entries(formValues) as [key, value]}
          <input type="hidden" name={key} {value} />
        {/each}

        <div
          class="flex justify-between flex-col items-start text-sm text-gray-500 gap-2"
        >
          <div class="flex items-center gap-2">
            <InputCheck
              id="accept-terms"
              label="Acepto los términos y condiciones"
              onchange={(v) =>
                (formValues = { ...formValues, "accept-terms": v })}
            />
          </div>
        </div>

        {#if form?.code}
          <Alert variant="danger" message={form.message} />
        {/if}
        <ButtonWithLoading
          type="submit"
          label="Registrarse"
          variant="primary"
          size="large"
          class="w-full! bg-primary/90!  text-center! hover:bg-primary-700! justify-center!"
        />
      </form>
    </div>

    <div
      class="bg-linear-to-b from-white to-primary/20 flex items-center justify-center p-8 hover:shadow-lg transition-shadow duration-300 hover:border-linear-to-b hover:from-white hover:to-primary/40"
    >
      <img
        src={IMAGE_URL}
        alt="Illustration"
        class="w-[80%] max-h-[480px] object-contain hover:scale-105 transition-transform duration-300"
      />
    </div>
  </Card>
</main>
