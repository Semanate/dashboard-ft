<script lang="ts">
  import {
    Alert,
    ButtonWithLoading,
    FormSection,
    Card,
    InputCheck,
  } from "$lib/components";
  import type { NewsItem } from "$lib/types/news.js";

  let { form, data } = $props();
  let loading = $state(false);
  const { news }: { news: NewsItem[] } = data;
</script>

<main class="min-h-screen flex items-center justify-center bg-primary/10 p-6">
  <Card
    content=""
    title=""
    class="w-full max-w-6xl overflow-hidden rounded-3xl shadow-xl grid grid-cols-1 lg:grid-cols-2 bg-white"
  >
    <!-- LOGIN -->
    <section class="p-10 lg:p-14 flex flex-col justify-center">
      <header class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">¡Bienvenido!</h1>
        <p class="text-gray-500 mt-1">Inicia sesión para continuar</p>
      </header>

      <form method="POST" class="space-y-6">
        <FormSection
          fields={[
            {
              id: "email",
              type: "email",
              label: "Correo electrónico",
              placeholder: "correo@ejemplo.com",
              value: "",
            },
            {
              id: "password",
              type: "password",
              label: "Contraseña",
              placeholder: "••••••••",
              value: "",
            },
          ]}
        />

        <div class="flex items-center justify-between text-sm text-gray-500">
          <InputCheck id="remember" label="Recordarme" />
          <a href="#" class="hover:underline">¿Olvidaste tu contraseña?</a>
        </div>

        {#if form?.code}
          <Alert variant="danger" message={form.message} />
        {/if}

        <ButtonWithLoading
          type="submit"
          label="Iniciar sesión"
          variant="primary"
          size="large"
          class="w-full items-center justify-center"
          {loading}
        />
      </form>

      <footer class="mt-8 text-sm text-gray-600">
        ¿No tienes una cuenta?
        <a href="/register" class="font-semibold text-primary hover:underline">
          Crear cuenta
        </a>
      </footer>
    </section>

    <!-- INFO / TRUST -->

    <aside class="hidden lg:flex flex-col justify-center bg-primary/5 px-12">
      <h2 class="text-2xl font-semibold text-gray-900 mb-6">
        Información de interés
      </h2>

      {#if news.length > 0}
        {@const activeNews = news[0]}
        <div
          class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 w-full"
        >
          <div
            class="prose prose-sm prose-gray max-w-none text-gray-600 space-y-2 font-medium"
          >
            <div class="whitespace-pre-line leading-loose">
              {activeNews.content}
            </div>
          </div>

          <div
            class="mt-6 text-xs text-gray-400 border-t border-gray-100 pt-3 flex justify-between items-center"
          >
            <span>Actualizado</span>
            <span
              >{new Date(
                activeNews.updated_at || activeNews.created_at,
              ).toLocaleDateString("es-CO")}</span
            >
          </div>
        </div>
      {:else}
        <p class="text-gray-500 text-sm italic">
          No hay información vigente en este momento.
        </p>
      {/if}
    </aside>
  </Card>
</main>
