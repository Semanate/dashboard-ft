<script lang="ts">
  import DataTable from "$lib/components/organisms/data-table/DataTable.svelte";
  import { createDataTable } from "$lib/components/organisms/data-table/DataTable.headless.svelte.js";

  // export let data;

  const columns = [
    { key: "id", label: "ID" },
    { key: "email", label: "Email", sortable: true },
    { key: "role", label: "Rol", sortable: true },
  ];

  const exampleUsers = [
    { id: "1", email: "asa@gmail.com", role: "admin" },
    { id: "2", email: "adasd@gmail.com", role: "user" },
    { id: "3", email: "asdad123123@gmail.com", role: "user" },
    { id: "4", email: "example4@gmail.com", role: "user" },
    { id: "5", email: "example5@gmail.com", role: "user" },
    { id: "6", email: "example6@gmail.com", role: "user" },
    { id: "7", email: "example7@gmail.com", role: "user" },
    { id: "8", email: "example8@gmail.com", role: "user" },
    { id: "9", email: "example9@gmail.com", role: "user" },
    { id: "10", email: "example10@gmail.com", role: "user" },
  ];
  const table = createDataTable(exampleUsers, columns);
  console.log(table.rows());

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
