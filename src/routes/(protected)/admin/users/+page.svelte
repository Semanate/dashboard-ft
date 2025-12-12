<script lang="ts">
  import DataTable from "$lib/components/organisms/data-table/DataTable.svelte";
  const users = [
    { id: 1, name: "Kevin", role: "admin" },
    { id: 2, name: "Ana", role: "user" },
  ];

  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Nombre" },
    { key: "role", label: "Rol" },
  ];
</script>

<section class="prose max-w-full">
  <h1>Users Management</h1>
  <p>This is the admin users management page.</p>

  <DataTable {columns} rows={users} />
</section>
