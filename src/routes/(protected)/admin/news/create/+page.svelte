<script lang="ts">
  import { goto } from "$app/navigation";
  import { enhance } from "$app/forms";
  import { Alert, Button, ButtonWithIcon, PageHeader } from "$lib/components";

  let { form }: { form?: any } = $props();

  function handleCancel() {
    goto("/admin/news");
  }
</script>

<svelte:head>
  <title>Crear Nueva Noticia - Admin</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <div class="w-full mx-auto">
    <PageHeader
      title="Crear Nueva Noticia"
      subtitle="Agrega una nueva noticia o publicación al sistema"
      icon="FilePlus"
    >
      <ButtonWithIcon
        type="button"
        iconButton="ArrowLeftIcon"
        onclick={handleCancel}
        variant="secondary"
        label="Volver"
      />
    </PageHeader>

    {#if form?.error}
      <Alert variant="danger" message={form.error} class="mb-4" />
    {/if}

    <form method="POST" use:enhance class="bg-white rounded-lg shadow-lg p-6">
      <div class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              for="title"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Título *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Título de la noticia"
              required
              class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label
              for="author"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Autor *
            </label>
            <input
              type="text"
              id="author"
              name="author"
              placeholder="Nombre del autor"
              required
              class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label
            for="excerpt"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            Resumen
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            placeholder="Resumen breve de la noticia..."
            rows="3"
            class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
        </div>

        <div>
          <label
            for="content"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            Contenido *
          </label>
          <textarea
            id="content"
            name="content"
            placeholder="Contenido completo de la noticia..."
            rows="12"
            required
            class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              for="status"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Estado
            </label>
            <select
              id="status"
              name="status"
              class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="draft">Borrador</option>
              <option value="published">Publicado</option>
              <option value="archived">Archivado</option>
            </select>
          </div>
          <div>
            <label
              for="featured_image"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Imagen destacada (URL)
            </label>
            <input
              type="text"
              id="featured_image"
              name="featured_image"
              placeholder="https://ejemplo.com/imagen.jpg"
              class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label
              for="expiration_date"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Fecha de Vencimiento
            </label>
            <input
              type="date"
              id="expiration_date"
              name="expiration_date"
              class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label
            for="tags"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            Etiquetas (separadas por comas)
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            placeholder="tecnología, noticias, actualidad"
            class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div class="flex justify-end space-x-4 mt-8">
        <Button variant="secondary" label="Cancelar" onclick={handleCancel}>
          Cancelar
        </Button>
        <ButtonWithIcon
          type="submit"
          variant="primary"
          iconButton="SaveIcon"
          label="Guardar Noticia"
        />
      </div>
    </form>
  </div>
</div>
