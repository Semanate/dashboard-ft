<script lang="ts">
  import DataTable from "$lib/components/organisms/data-table/DataTable.svelte";
  import { createDataTable } from "$lib/components/organisms/data-table/DataTable.headless.svelte.js";
  import ConfirmModal from "$lib/components/atoms/modal/ConfirmModal.svelte";
  import { goto } from "$app/navigation";
  import { enhance } from "$app/forms";

  let { data, form }: { data: any; form?: any } = $props();

  const columns = [
    { key: "id" as const, label: "ID" },
    { key: "email" as const, label: "Email", sortable: true },
    { key: "name" as const, label: "Nombre", sortable: true },
    { key: "role" as const, label: "Rol", sortable: true },
    { key: "created_at" as const, label: "Creado el", sortable: true },
  ];

  // Transform data to show formatted dates and handle null names
  const transformedUsers = data.users.map((user: any) => ({
    ...user,
    name: user.name || 'Sin nombre',
    created_at: new Date(user.created_at).toLocaleDateString('es-ES'),
    role: user.role === 'admin' ? 'Administrador' : 'Usuario'
  }));

  const table = createDataTable(transformedUsers, columns);

  // Modal state
  let showDeleteModal = $state(false);
  let userToDelete = $state<any>(null);
  let showRoleModal = $state(false);
  let userToChangeRole = $state<any>(null);
  let newRole = $state('');

  function editUser(user: any) {
    goto(`/admin/users/edit/${user.id}`);
  }

  function deleteUser(user: any) {
    userToDelete = user;
    showDeleteModal = true;
  }

  function changeUserRole(user: any) {
    userToChangeRole = user;
    newRole = user.role === 'Administrador' ? 'user' : 'admin';
    showRoleModal = true;
  }

  function confirmDelete() {
    // TODO: Implement delete functionality
    console.log("Eliminando usuario:", userToDelete);
    showDeleteModal = false;
    userToDelete = null;
  }

  function cancelDelete() {
    showDeleteModal = false;
    userToDelete = null;
  }

  async function confirmRoleChange() {
    if (!userToChangeRole) return;

    const formData = new FormData();
    formData.append('userId', userToChangeRole.id);
    formData.append('role', newRole);

    await fetch('?/updateRole', {
      method: 'POST',
      body: formData
    });

    showRoleModal = false;
    userToChangeRole = null;
    // Reload page to see changes
    window.location.reload();
  }

  function cancelRoleChange() {
    showRoleModal = false;
    userToChangeRole = null;
  }
</script>

<svelte:head>
  <title>Gestión de Usuarios - Admin</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <div class="flex justify-between items-center mb-6">
    <h1 class="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
    <div class="text-sm text-gray-600">
      Total: {data.users.length} usuarios
    </div>
  </div>

  {#if form?.error}
    <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
      {form.error}
    </div>
  {/if}

  {#if form?.success}
    <div class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
      Usuario actualizado correctamente
    </div>
  {/if}

  <div class="bg-white rounded-lg shadow">
    <DataTable {table} onEdit={editUser} onDelete={deleteUser} />
  </div>

  <!-- Quick role change buttons for each user -->
  <div class="mt-6">
    <h2 class="text-xl font-semibold mb-4">Acciones Rápidas</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {#each data.users as user}
        <div class="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-900">{user.email}</p>
              <p class="text-xs text-gray-500">{user.name || 'Sin nombre'}</p>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}">
                {user.role === 'admin' ? 'Admin' : 'Usuario'}
              </span>
            </div>
            <button
              type="button"
              onclick={() => changeUserRole(user)}
              class="ml-2 px-3 py-1 text-xs font-medium rounded-md {user.role === 'admin' ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'} transition-colors"
            >
              {user.role === 'admin' ? 'Quitar Admin' : 'Hacer Admin'}
            </button>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>

<!-- Delete Confirmation Modal -->
<ConfirmModal
  isOpen={showDeleteModal}
  title="Eliminar Usuario"
  message="¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer."
  confirmText="Eliminar"
  cancelText="Cancelar"
  variant="danger"
  onConfirm={confirmDelete}
  onCancel={cancelDelete}
/>

<!-- Role Change Confirmation Modal -->
<ConfirmModal
  isOpen={showRoleModal}
  title="Cambiar Rol de Usuario"
  message="¿Estás seguro de que deseas cambiar el rol de este usuario?"
  confirmText="Cambiar"
  cancelText="Cancelar"
  variant="warning"
  onConfirm={confirmRoleChange}
  onCancel={cancelRoleChange}
/>
