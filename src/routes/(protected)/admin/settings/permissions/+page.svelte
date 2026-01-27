<script lang="ts">
    import { enhance } from "$app/forms";
    import { ROLES, ROLE_LABELS, type Role } from "$lib/types/roles";
    import { 
        Alert, 
        Button, 
        ButtonWithIcon, 
        Modal, 
        ConfirmModal,
        Card,
        PageHeader,
        StatCard,
        Badge
    } from "$lib/components";

    interface Permission {
        id: string;
        code: string;
        name: string;
        description: string;
        module: string;
    }

    interface PageData {
        permissions: Permission[];
        permissionsByModule: Record<string, Permission[]>;
        rolePermissionsMap: Record<string, string[]>;
        modules: string[];
    }

    let { data, form }: { data: PageData; form?: any } = $props();

    // Estado para los permisos seleccionados por rol
    let selectedRole = $state<Role>(ROLES.USER);
    let selectedPermissions = $state<Set<string>>(new Set());
    let isSubmitting = $state(false);
    let hasChanges = $state(false);

    // Estado para el modal de crear/editar permiso
    let showPermissionModal = $state(false);
    let editingPermission = $state<Permission | null>(null);
    let permissionForm = $state({
        code: "",
        name: "",
        description: "",
        module: "",
    });
    let newModule = $state("");
    let useNewModule = $state(false);

    // Estado para el modal de confirmación de eliminación
    let showDeleteModal = $state(false);
    let permissionToDelete = $state<Permission | null>(null);

    // Inicializar permisos seleccionados cuando cambia el rol
    $effect(() => {
        const perms = data.rolePermissionsMap[selectedRole] || [];
        selectedPermissions = new Set(perms);
        hasChanges = false;
    });

    const moduleLabels: Record<string, string> = {
        dashboard: "📊 Dashboard",
        users: "👥 Usuarios",
        sarlaft: "📋 SARLAFT",
        news: "📰 Noticias",
        reports: "📈 Reportes",
        settings: "⚙️ Configuración",
        profile: "👤 Perfil",
    };

    function togglePermission(permissionId: string) {
        const newSet = new Set(selectedPermissions);
        if (newSet.has(permissionId)) {
            newSet.delete(permissionId);
        } else {
            newSet.add(permissionId);
        }
        selectedPermissions = newSet;
        hasChanges = true;
    }

    function selectAll(module: string) {
        const modulePerms = data.permissionsByModule[module] || [];
        const newSet = new Set(selectedPermissions);
        modulePerms.forEach((p) => newSet.add(p.id));
        selectedPermissions = newSet;
        hasChanges = true;
    }

    function deselectAll(module: string) {
        const modulePerms = data.permissionsByModule[module] || [];
        const newSet = new Set(selectedPermissions);
        modulePerms.forEach((p) => newSet.delete(p.id));
        selectedPermissions = newSet;
        hasChanges = true;
    }

    function isModuleFullySelected(module: string): boolean {
        const modulePerms = data.permissionsByModule[module] || [];
        return modulePerms.every((p) => selectedPermissions.has(p.id));
    }

    function getPermissionsJson(): string {
        return JSON.stringify(Array.from(selectedPermissions));
    }

    // Funciones para el modal de permisos
    function openCreateModal() {
        editingPermission = null;
        permissionForm = { code: "", name: "", description: "", module: "" };
        newModule = "";
        useNewModule = false;
        showPermissionModal = true;
    }

    function openEditModal(permission: Permission) {
        editingPermission = permission;
        permissionForm = {
            code: permission.code,
            name: permission.name,
            description: permission.description || "",
            module: permission.module,
        };
        newModule = "";
        useNewModule = false;
        showPermissionModal = true;
    }

    function closePermissionModal() {
        showPermissionModal = false;
        editingPermission = null;
    }

    function openDeleteModal(permission: Permission) {
        permissionToDelete = permission;
        showDeleteModal = true;
    }

    function closeDeleteModal() {
        showDeleteModal = false;
        permissionToDelete = null;
    }

    function getSelectedModule(): string {
        return useNewModule ? newModule : permissionForm.module;
    }

    function generateCode(name: string): string {
        return name
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "_")
            .replace(/^_|_$/g, "");
    }

    function autoGenerateCode() {
        if (!editingPermission && permissionForm.name) {
            permissionForm.code = generateCode(permissionForm.name);
        }
    }
</script>

<svelte:head>
    <title>Gestión de Permisos - Admin</title>
</svelte:head>

<div class="container mx-auto px-4 py-8 max-w-6xl">
    <PageHeader
        title="Gestión de Permisos"
        subtitle="Configura los permisos para cada rol del sistema. Los cambios afectarán a todos los usuarios con ese rol."
    >
        <ButtonWithIcon
            label="Nuevo Permiso"
            iconButton="Plus"
            variant="primary"
            onclick={openCreateModal}
        />
    </PageHeader>

    {#if form?.error}
        <div class="mb-6">
            <Alert type="error" message={form.error} />
        </div>
    {/if}

    {#if form?.success}
        <div class="mb-6">
            <Alert type="success" message={form.message} />
        </div>
    {/if}

    <!-- Selector de Rol -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <label
            for="role-selector"
            class="block text-sm font-medium text-gray-700 mb-3"
        >
            Seleccionar Rol a Configurar
        </label>
        <div class="flex gap-4 flex-wrap">
            {#each Object.values(ROLES) as role}
                <button
                    type="button"
                    onclick={() => (selectedRole = role)}
                    class="px-6 py-3 rounded-lg font-medium transition-all {selectedRole ===
                    role
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
                >
                    {ROLE_LABELS[role]}
                </button>
            {/each}
        </div>
    </div>

    <!-- Formulario de Permisos -->
    <form
        method="POST"
        action="?/updateRolePermissions"
        use:enhance={() => {
            isSubmitting = true;
            return async ({ update }) => {
                await update();
                isSubmitting = false;
                hasChanges = false;
            };
        }}
    >
        <input type="hidden" name="role" value={selectedRole} />
        <input type="hidden" name="permissions" value={getPermissionsJson()} />

        <div
            class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
            <div
                class="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center"
            >
                <div>
                    <h2 class="text-lg font-semibold text-gray-900">
                        Permisos para: <span class="text-indigo-600"
                            >{ROLE_LABELS[selectedRole]}</span
                        >
                    </h2>
                    <p class="text-sm text-gray-500 mt-1">
                        {selectedPermissions.size} de {data.permissions
                            ?.length || 0} permisos seleccionados
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting || !hasChanges}
                    class="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700
                           disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                >
                    {#if isSubmitting}
                        <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle
                                class="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                stroke-width="4"
                                fill="none"
                            />
                            <path
                                class="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            />
                        </svg>
                        Guardando...
                    {:else}
                        💾 Guardar Cambios
                    {/if}
                </button>
            </div>

            <div class="divide-y divide-gray-200">
                {#each Object.entries(data.permissionsByModule || {}) as [module, permissions]}
                    <div class="p-6">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-lg font-medium text-gray-900">
                                {moduleLabels[module] || module}
                            </h3>
                            <div class="flex gap-2">
                                <button
                                    type="button"
                                    onclick={() => selectAll(module)}
                                    class="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                                >
                                    Seleccionar todos
                                </button>
                                <button
                                    type="button"
                                    onclick={() => deselectAll(module)}
                                    class="text-xs px-3 py-1 rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                                >
                                    Deseleccionar
                                </button>
                            </div>
                        </div>

                        <div
                            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                        >
                            {#each permissions as permission}
                                <div
                                    class="flex flex-col p-4 rounded-lg border transition-all
                                           {selectedPermissions.has(
                                        permission.id,
                                    )
                                        ? 'border-indigo-300 bg-indigo-50'
                                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}"
                                >
                                    <label
                                        class="flex items-start gap-3 cursor-pointer flex-1"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedPermissions.has(
                                                permission.id,
                                            )}
                                            onchange={() =>
                                                togglePermission(permission.id)}
                                            class="mt-1 h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                        />
                                        <div class="flex-1">
                                            <div
                                                class="font-medium text-gray-900"
                                            >
                                                {permission.name}
                                            </div>
                                            <div
                                                class="text-xs text-gray-500 mt-1"
                                            >
                                                {permission.description}
                                            </div>
                                            <div
                                                class="text-xs text-gray-400 mt-1 font-mono"
                                            >
                                                {permission.code}
                                            </div>
                                        </div>
                                    </label>
                                    <div
                                        class="flex gap-2 mt-3 pt-3 border-t border-gray-200"
                                    >
                                        <button
                                            type="button"
                                            onclick={() =>
                                                openEditModal(permission)}
                                            class="flex-1 text-xs px-2 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                                        >
                                            ✏️ Editar
                                        </button>
                                        <button
                                            type="button"
                                            onclick={() =>
                                                openDeleteModal(permission)}
                                            class="flex-1 text-xs px-2 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                                        >
                                            🗑️ Eliminar
                                        </button>
                                    </div>
                                </div>
                            {/each}
                        </div>
                    </div>
                {/each}
            </div>
        </div>

        {#if hasChanges}
            <div
                class="fixed bottom-6 right-6 bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3"
            >
                <span>⚠️ Tienes cambios sin guardar</span>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    class="px-4 py-1 bg-yellow-600 text-white rounded-md font-medium hover:bg-yellow-700 disabled:opacity-50"
                >
                    Guardar
                </button>
            </div>
        {/if}
    </form>

    <!-- Resumen de permisos actuales -->
    <div class="mt-8">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
            📊 Resumen de Permisos por Rol
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            {#each Object.entries(ROLE_LABELS) as [role, label]}
                <StatCard
                    title={label}
                    value={data.rolePermissionsMap[role]?.length || 0}
                    subtitle="permisos asignados"
                    variant="primary"
                />
            {/each}
        </div>
    </div>
</div>

<!-- Modal de Crear/Editar Permiso -->
<Modal
    isOpen={showPermissionModal}
    title={editingPermission ? "✏️ Editar Permiso" : "➕ Nuevo Permiso"}
    size="lg"
    onClose={closePermissionModal}
>
    <form
        method="POST"
        action={editingPermission ? "?/updatePermission" : "?/createPermission"}
        use:enhance={() => {
            isSubmitting = true;
            return async ({ result, update }) => {
                await update();
                isSubmitting = false;
                if (result.type === "success") {
                    closePermissionModal();
                }
            };
        }}
        class="space-y-4"
    >
        {#if editingPermission}
            <input type="hidden" name="id" value={editingPermission.id} />
        {/if}

        <div>
            <label for="perm-name" class="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Permiso *
            </label>
            <input
                type="text"
                id="perm-name"
                name="name"
                bind:value={permissionForm.name}
                oninput={autoGenerateCode}
                required
                placeholder="Ej: Ver Reportes Financieros"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
        </div>

        <div>
            <label for="perm-code" class="block text-sm font-medium text-gray-700 mb-1">
                Código (snake_case) *
            </label>
            <input
                type="text"
                id="perm-code"
                name="code"
                bind:value={permissionForm.code}
                required
                placeholder="Ej: view_financial_reports"
                pattern="^[a-z][a-z0-9_]*$"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono"
            />
            <p class="text-xs text-gray-500 mt-1">Solo letras minúsculas, números y guiones bajos</p>
        </div>

        <div>
            <label for="perm-description" class="block text-sm font-medium text-gray-700 mb-1">
                Descripción
            </label>
            <textarea
                id="perm-description"
                name="description"
                bind:value={permissionForm.description}
                rows="2"
                placeholder="Describe qué permite hacer este permiso..."
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            ></textarea>
        </div>

        <div>
            <!-- svelte-ignore a11y_label_has_associated_control -->
            <label class="block text-sm font-medium text-gray-700 mb-1">Módulo *</label>

            <div class="flex gap-4 mb-2">
                <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" bind:group={useNewModule} value={false} class="text-indigo-600" />
                    <span class="text-sm">Existente</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" bind:group={useNewModule} value={true} class="text-indigo-600" />
                    <span class="text-sm">Nuevo módulo</span>
                </label>
            </div>

            {#if useNewModule}
                <input
                    type="text"
                    bind:value={newModule}
                    placeholder="Ej: analytics"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
            {:else}
                <select
                    bind:value={permissionForm.module}
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                    <option value="">Seleccionar módulo...</option>
                    {#each data.modules || [] as mod}
                        <option value={mod}>{moduleLabels[mod] || mod}</option>
                    {/each}
                </select>
            {/if}
            <input type="hidden" name="module" value={getSelectedModule()} />
        </div>

        <div class="flex gap-3 pt-4">
            <Button
                label="Cancelar"
                variant="secondary"
                onclick={closePermissionModal}
            />
            <Button
                label={isSubmitting ? "Guardando..." : (editingPermission ? "Actualizar Permiso" : "Crear Permiso")}
                variant="primary"
                type="submit"
                disabled={isSubmitting || !permissionForm.name || !permissionForm.code || (!permissionForm.module && !newModule)}
            />
        </div>
    </form>
</Modal>

<!-- Modal de Confirmación de Eliminación -->
<Modal
    isOpen={showDeleteModal && !!permissionToDelete}
    title="⚠️ Eliminar Permiso"
    size="md"
    onClose={closeDeleteModal}
>
    {#if permissionToDelete}
        <div class="space-y-4">
            <p class="text-gray-700">
                ¿Estás seguro de que deseas eliminar el permiso:
            </p>
            <div class="bg-gray-50 rounded-lg p-3">
                <div class="font-medium text-gray-900">{permissionToDelete.name}</div>
                <div class="text-sm text-gray-500 font-mono">{permissionToDelete.code}</div>
            </div>
            <Alert type="warning" message="Esto eliminará el permiso de todos los roles que lo tengan asignado. Esta acción no se puede deshacer." />
        </div>

        <div class="flex gap-3 mt-6">
            <Button
                label="Cancelar"
                variant="secondary"
                onclick={closeDeleteModal}
            />
            <form
                method="POST"
                action="?/deletePermission"
                use:enhance={() => {
                    isSubmitting = true;
                    return async ({ update }) => {
                        await update();
                        isSubmitting = false;
                        closeDeleteModal();
                    };
                }}
                class="flex-1"
            >
                <input type="hidden" name="id" value={permissionToDelete.id} />
                <input type="hidden" name="name" value={permissionToDelete.name} />
                <button
                    type="submit"
                    disabled={isSubmitting}
                    class="w-full px-4 py-2 bg-red-600 text-white rounded font-semibold hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                    {isSubmitting ? "Eliminando..." : "Eliminar Permiso"}
                </button>
            </form>
        </div>
    {/if}
</Modal>
