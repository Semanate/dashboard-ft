<script lang="ts">
  import DataTable from "$lib/components/organisms/data-table/DataTable.svelte";
  import { createDataTable } from "$lib/components/organisms/data-table/DataTable.headless.svelte.js";
  import { Button, PageHeader } from "$lib/components";
  import { goto } from "$app/navigation";

  let { data } = $props();

  const columns = [
    { key: "id" as const, label: "ID" },
    { key: "title" as const, label: "Título", sortable: true },
    { key: "author" as const, label: "Autor", sortable: true },
    { key: "status" as const, label: "Estado", sortable: true },
    { key: "created_at" as const, label: "Creado el", sortable: true },
  ];

  const items = data.news.map((newsItem: any) => ({
    ...newsItem,
    created_at: new Date(newsItem.created_at).toLocaleDateString('es-ES'),
    status: newsItem.status == 'published' ? 'Publicado' : 'Borrador'
  }));
  const table = createDataTable(items, columns);

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
  <PageHeader
    title="Gestión de Noticias"
    subtitle="Administra las noticias y publicaciones del sistema"
    icon="Newspaper"
  >
    <Button onclick={createNews} variant="primary" label="Crear Nueva Noticia"/>
  </PageHeader>

  <div class="bg-white rounded-lg shadow">
    <DataTable {table} onEdit={editNews} onDelete={deleteNews} />
  </div>
</div>