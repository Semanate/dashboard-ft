<script lang="ts">
  import DataTable from "$lib/components/organisms/data-table/DataTable.svelte";
  import { createDataTable } from "$lib/components/organisms/data-table/DataTable.headless.svelte.js";
  import Button from "$lib/components/atoms/button/Button.svelte";
  import { goto } from "$app/navigation";

  export let data;

  const columns = [
    { key: "id", label: "ID" },
    { key: "title", label: "Título", sortable: true },
    { key: "author", label: "Autor", sortable: true },
    { key: "status", label: "Estado", sortable: true },
    { key: "created_at", label: "Creado el", sortable: true },
  ];

  const table = createDataTable(data.news, columns);

  function editNews(newsItem: any) {
    goto(`/admin/news/edit/${newsItem.id}`);
  }

  async function deleteNews(newsItem: any) {
    if (!confirm("¿Eliminar esta noticia?")) return;

    const formData = new FormData();
    formData.append('id', newsItem.id.toString());

    await fetch('?/delete', {
      method: 'POST',
      body: formData
    });

    window.location.reload();
  }

  function createNews() {
    goto('/admin/news/create');
  }
</script>

<svelte:head>
  <title>Gestión de Noticias - Admin</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <div class="flex justify-between items-center mb-6">
    <h1 class="text-3xl font-bold text-gray-900">Gestión de Noticias</h1>
    <Button onclick={createNews} variant="primary" label="Crear Nueva Noticia"/>
  </div>

  <div class="bg-white rounded-lg shadow">
    <DataTable {table} onEdit={editNews} onDelete={deleteNews} />
  </div>
</div>