<script lang="ts">
  import ButtonWithLoading from "$lib/components/atoms/button/ButtonWithLoading.svelte";
  import IMAGE_URL from "$lib/assets/Login-cuate.svg";
  import FormSection from "$lib/components/molecules/form-section/FormSection.svelte";
  import Card from "$lib/components/molecules/card/Card.svelte";
  import InputCheck from "$lib/components/atoms/input/InputCheck.svelte";
  export let form;

  let formValues: Record<string, any> = {};

  function updateField(id: string, value: any) {
    formValues = {
      ...formValues,
      [id]: value,
    };
  }

  const fields = [
    {
      id: "full-name",
      type: "text",
      label: "Nombre Completo",
      value: formValues["full-name"] ?? "",
      onchange: (v) => updateField("full-name", v),
      placeholder: "Ingresa tu nombre completo",
    },
    {
      id: "email",
      type: "email",
      label: "Correo",
      placeholder: "Ingresa tu correo electrónico",
      value: formValues.email ?? "",
      onchange: (v) => updateField("email", v),
    },
    {
      id: "password",
      type: "password",
      label: "Contraseña",
      value: formValues.password ?? "",
      onchange: (v) => updateField("password", v),
      placeholder: "Ingresa tu contraseña",
    },

    {
      id: "confirm-password",
      type: "password",
      label: "Confirmar Contraseña",
      value: formValues["confirm-password"] ?? "",
      onchange: (v) => updateField("confirm-password", v),
      placeholder: "Confirma tu contraseña",
    },
    {
      id: "phone",
      type: "text",
      label: "Teléfono",
      value: formValues.phone ?? "",
      onchange: (v) => updateField("phone", v),
      placeholder: "Ingresa tu número de teléfono",
    },
  ];
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
          <!-- <a href="#" class="hover:underline">Ya tengo cuenta?</a> -->
        </div>

        {#if form?.error}
          <div class="p-2 bg-red-50 text-red-600 rounded">
            {form.error}
          </div>
        {/if}

        {#if form?.code}
          <div class="p-2 bg-red-50 text-red-600 rounded">
            {form.message}
          </div>
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
