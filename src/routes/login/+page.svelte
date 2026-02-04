<script lang="ts">
  import { enhance } from "$app/forms";
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
  let loginMode = $state("password"); // 'password' or 'magic'
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
        <p class="text-gray-500 mt-1">
          {loginMode === "password"
            ? "Inicia sesión con tu cuenta"
            : "Ingresa tu correo para recibir un enlace de acceso"}
        </p>
      </header>

      <div class="flex p-1 bg-gray-100 rounded-xl mb-8">
        <button
          class="flex-1 py-2 text-sm font-medium rounded-lg transition-all {loginMode ===
          'password'
            ? 'bg-white shadow-sm text-primary'
            : 'text-gray-500'}"
          onclick={() => (loginMode = "password")}
        >
          Contraseña
        </button>
        <button
          class="flex-1 py-2 text-sm font-medium rounded-lg transition-all {loginMode ===
          'magic'
            ? 'bg-white shadow-sm text-primary'
            : 'text-gray-500'}"
          onclick={() => (loginMode = "magic")}
        >
          Magic Link
        </button>
      </div>

      <form
        method="POST"
        action={loginMode === "password" ? "?/login" : "?/magic"}
        use:enhance={() => {
          loading = true;
          return async ({ update }) => {
            await update();
            loading = false;
          };
        }}
        class="space-y-6"
      >
        <FormSection
          fields={loginMode === "password"
            ? [
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
              ]
            : [
                {
                  id: "email",
                  type: "email",
                  label: "Correo electrónico",
                  placeholder: "correo@ejemplo.com",
                  value: "",
                },
              ]}
        />

        {#if loginMode === "password"}
          <div class="flex items-center justify-between text-sm text-gray-500">
            <InputCheck id="remember" label="Recordarme" />
            <a href="/forgot-password" class="hover:underline"
              >¿Olvidaste tu contraseña?</a
            >
          </div>
        {/if}

        {#if form?.code || form?.error}
          <Alert variant="danger" message={form.message} />
        {/if}

        {#if form?.success}
          <Alert variant="success" message={form.message} />
        {/if}

        <ButtonWithLoading
          type="submit"
          label={loginMode === "password"
            ? "Iniciar sesión"
            : "Enviar enlace mágico"}
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
