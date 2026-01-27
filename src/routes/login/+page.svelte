<script lang="ts">
  import { Alert, ButtonWithLoading, FormSection, Card, InputCheck } from "$lib/components";
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
        <a href="#" class="font-semibold text-primary hover:underline">
          Crear cuenta
        </a>
      </footer>
    </section>

    <!-- INFO / TRUST -->

    <aside class="hidden lg:flex flex-col justify-center bg-primary/5 px-12">
      <h2 class="text-2xl font-semibold text-gray-900 mb-2">
        Últimas noticias
      </h2>

      <p class="text-gray-600 mb-6 text-sm">
        Actualizaciones recientes sobre normativa y cumplimiento
      </p>

      <ul class="space-y-5">
        {#each news as item}
          <li class="border-l-4 border-primary pl-4">
            <p class="text-sm font-semibold text-gray-900 leading-snug">
              {item.title}
            </p>

            <p class="text-xs text-gray-500 mt-1">
              {new Date(item.created_at).toLocaleDateString("es-CO")}
            </p>

            <p class="text-sm text-gray-600 mt-2 leading-relaxed line-clamp-2">
              {item.excerpt}
            </p>
          </li>
        {/each}
      </ul>
    </aside>
  </Card>
</main>
