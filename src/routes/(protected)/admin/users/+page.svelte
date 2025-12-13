<script lang="ts">
  import DataTable from "$lib/components/organisms/data-table/DataTable.svelte";
  import { createDataTable } from "$lib/components/organisms/data-table/DataTable.headless.svelte.js";

  export let data;

  const columns = [
    { key: "id", label: "ID" },
    { key: "email", label: "Email", sortable: true },
    { key: "role", label: "Rol", sortable: true },
    { key: "created_at", label: "Creado el", sortable: true },
  ];

  const exampleUsers = data.users;

  const table = createDataTable(exampleUsers, columns);

  function editUser(user) {
    console.log("Editar", user);
  }

  async function deleteUser(user) {
    if (!confirm("Eliminar usuario?")) return;

    await fetch(`/admin/users/${user.id}`, {
      method: "DELETE",
    });
  }
</script>

<DataTable {table} onEdit={editUser} onDelete={deleteUser} />
