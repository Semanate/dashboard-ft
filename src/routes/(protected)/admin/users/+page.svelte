<script lang="ts">
  import DataTable from "$lib/components/organisms/data-table/DataTable.svelte";
  import { createDataTable } from "$lib/components/organisms/data-table/DataTable.headless.svelte.js";
  import ConfirmModal from "$lib/components/atoms/modal/ConfirmModal.svelte";
  import { Alert, Badge, Button, Modal, PageHeader } from "$lib/components";
  import { goto } from "$app/navigation";
  import { enhance } from "$app/forms";
  import { getAllRoles, getRoleLabel, ROLES, type Role } from "$lib/types/roles";

  let { data, form }: { data: any; form?: any } = $props();

  // Obtener todos los roles disponibles
  const availableRoles = getAllRoles();

  const columns = [
    { key: "id" as const, label: "ID" },
    { key: "email" as const, label: "Email", sortable: true },
    { key: "name" as const, label: "Nombre", sortable: true },
    { key: "roleLabel" as const, label: "Rol", sortable: true },
    { key: "created_at" as const, label: "Creado el", sortable: true },
  ];

  // Transform data to show formatted dates and handle null names
  const transformedUsers = data.users.map((user: any) => ({
    ...user,
    name: user.name || user.user_metadata?.display_name || 'Sin nombre',
    created_at: new Date(user.created_at).toLocaleDateString('es-ES'),
    roleLabel: user.roleLabel || getRoleLabel(user.role)
  }));

  const table = createDataTable(transformedUsers, columns);

  // Modal state
  let showDeleteModal = $state(false);
  let userToDelete = $state<any>(null);
  let showRoleModal = $state(false);
  let userToChangeRole = $state<any>(null);
  let newRole = $state<Role>(ROLES.USER);

  function editUser(user: any) {
    goto(`/admin/users/edit/${user.id}`);
  }

  function deleteUser(user: any) {
    userToDelete = user;
    showDeleteModal = true;
  }

  function openRoleChangeModal(user: any) {
    userToChangeRole = user;
    newRole = user.role; // Iniciar con el rol actual
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

  // Función para obtener la variante de badge según el rol
  function getRoleBadgeVariant(role: Role): 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' {
    switch (role) {
      case ROLES.ADMIN:
        return 'primary';
      case ROLES.COMPLIANCE_OFFICER:
        return 'info';
      default:
        return 'default';
    }
  }
</script>

<svelte:head>
  <title>Gestión de Usuarios - Admin</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <PageHeader
    title="Gestión de Usuarios"
    subtitle="Total: {data.users.length} usuarios"
    icon="Users"
  />

  {#if form?.error}
    <Alert variant="danger" class="mb-4">
      {form.error}
    </Alert>
  {/if}

  {#if form?.success}
    <Alert variant="success" class="mb-4">
      Usuario actualizado correctamente
    </Alert>
  {/if}

  <div class="bg-white rounded-lg shadow">
    <DataTable {table} onEdit={editUser} onDelete={deleteUser} />
  </div>

  <!-- Quick role change buttons for each user -->
  <div class="mt-6">
    <h2 class="text-xl font-semibold mb-4">Gestión de Roles</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {#each data.users as user}
        <div class="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div class="flex flex-col gap-3">
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-900">{user.email}</p>
              <p class="text-xs text-gray-500">{user.name || user.user_metadata?.display_name || 'Sin nombre'}</p>
              <Badge
                label={getRoleLabel(user.role)}
                variant={getRoleBadgeVariant(user.role)}
                size="sm"
                class="mt-1"
              />
            </div>
            <Button
              label="Cambiar Rol"
              variant="secondary"
              size="small"
              onclick={() => openRoleChangeModal(user)}
              class="w-full"
            />
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

<!-- Role Change Modal with Select -->
<Modal
  isOpen={showRoleModal && !!userToChangeRole}
  title="Cambiar Rol de Usuario"
  onClose={cancelRoleChange}
>
  {#if userToChangeRole}
    <div class="mb-4">
      <p class="text-sm text-gray-600 mb-2">Usuario: <span class="font-medium">{userToChangeRole.email}</span></p>
      <p class="text-sm text-gray-600 mb-4">Rol actual: <span class="font-medium">{getRoleLabel(userToChangeRole.role)}</span></p>
      
      <label for="role-select" class="block text-sm font-medium text-gray-700 mb-2">
        Seleccionar nuevo rol:
      </label>
      <select
        id="role-select"
        bind:value={newRole}
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
      >
        {#each availableRoles as role}
          <option value={role.value}>{role.label}</option>
        {/each}
      </select>
      <p class="mt-2 text-xs text-gray-500">
        {availableRoles.find(r => r.value === newRole)?.description || ''}
      </p>
    </div>
    
    <div class="flex gap-3 justify-end">
      <Button
        label="Cancelar"
        variant="secondary"
        onclick={cancelRoleChange}
      />
      <Button
        label="Guardar Cambios"
        variant="primary"
        onclick={confirmRoleChange}
        disabled={newRole === userToChangeRole.role}
      />
    </div>
  {/if}
</Modal>
