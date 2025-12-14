<script lang="ts">
  import Button from "$lib/components/atoms/button/Button.svelte";
  import { goto } from "$app/navigation";
  import { enhance } from "$app/forms";

  let { data, form }: { data: any; form?: any } = $props();

  function handleCancel() {
    goto('/admin/news');
  }
</script>

<svelte:head>
  <title>Editar Noticia - Admin</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <div class="max-w-4xl mx-auto">
    <div class="flex items-center mb-6">
      <button 
        type="button" 
        onclick={handleCancel}
        class="mr-4 text-gray-600 hover:text-gray-900"
      >
        ← Volver
      </button>
      <h1 class="text-3xl font-bold text-gray-900">Editar Noticia</h1>
    </div>

    {#if form?.error}
      <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
        {form.error}
      </div>
    {/if}

    <form 
      method="POST" 
      use:enhance
      class="bg-white rounded-lg shadow-lg p-6"
    >
      <div class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
              Título *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Título de la noticia"
              value={data.newsItem.title}
              required
              class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label for="author" class="block text-sm font-medium text-gray-700 mb-2">
              Autor *
            </label>
            <input
              type="text"
              id="author"
              name="author"
              placeholder="Nombre del autor"
              value={data.newsItem.author}
              required
              class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label for="excerpt" class="block text-sm font-medium text-gray-700 mb-2">
            Resumen
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            placeholder="Resumen breve de la noticia..."
            rows="3"
            value={data.newsItem.excerpt || ''}
            class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
        </div>

        <div>
          <label for="content" class="block text-sm font-medium text-gray-700 mb-2">
            Contenido *
          </label>
          <textarea
            id="content"
            name="content"
            placeholder="Contenido completo de la noticia..."
            rows="12"
            required
            value={data.newsItem.content}
            class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="status" class="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <select
              id="status"
              name="status"
              value={data.newsItem.status}
              class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="draft">Borrador</option>
              <option value="published">Publicado</option>
              <option value="archived">Archivado</option>
            </select>
          </div>
          <div>
            <label for="featured_image" class="block text-sm font-medium text-gray-700 mb-2">
              Imagen destacada (URL)
            </label>
            <input
              type="text"
              id="featured_image"
              name="featured_image"
              placeholder="https://ejemplo.com/imagen.jpg"
              value={data.newsItem.featured_image || ''}
              class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label for="tags" class="block text-sm font-medium text-gray-700 mb-2">
            Etiquetas (separadas por comas)
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            placeholder="tecnología, noticias, actualidad"
            value={data.newsItem.tags ? data.newsItem.tags.join(', ') : ''}
            class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div class="flex justify-end space-x-4 mt-8">
        <Button 
          variant="secondary"
          label="Cancelar"
          onclick={handleCancel}
        >
          Cancelar
        </Button>
        <button 
          type="submit"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Actualizar Noticia
        </button>
      </div>
    </form>
  </div>
</div>