<script lang="ts">
    import Button from "$lib/components/atoms/button/Button.svelte";
    import { goto } from "$app/navigation";
    import { enhance } from "$app/forms";
    import ButtonWithIcon from "$lib/components/atoms/button/ButtonWithIcon.svelte";

    let { data, form }: { data: any; form?: any } = $props();

    const roleOptions = [
        { value: "user", label: "Usuario" },
        { value: "admin", label: "Administrador" },
    ];

    function handleCancel() {
        goto("/admin/users");
    }
</script>

<svelte:head>
    <title>Editar Usuario - Admin</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
    <div class="w-full mx-auto">
        <div class="flex items-center mb-6">
            <ButtonWithIcon
                type="button"
                label="Volver"
                variant="ghost"
                iconButton="ArrowLeft"
                onclick={handleCancel}
                class="mr-4 text-gray-600 hover:text-gray-900"
            />
            <h1 class="text-3xl font-bold text-gray-900">Editar Usuario</h1>
        </div>

        {#if form?.error}
            <div
                class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4"
            >
                {form.error}
            </div>
        {/if}

        <form
            method="POST"
            action="?/update"
            use:enhance
            class="bg-white rounded-lg shadow-lg p-6"
        >
            <div class="space-y-6">
                <!-- Información no editable -->
                <div class="bg-gray-50 rounded-lg p-4">
                    <h3 class="text-lg font-medium text-gray-900 mb-4">
                        Información del Usuario
                    </h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <span
                                class="block text-sm font-medium text-gray-700 mb-1"
                                >ID</span
                            >
                            <div
                                class="text-sm text-gray-900 bg-white px-3 py-2 rounded border"
                            >
                                {data.user.id}
                            </div>
                        </div>
                        <div>
                            <span
                                class="block text-sm font-medium text-gray-700 mb-1"
                                >Email</span
                            >
                            <div
                                class="text-sm text-gray-900 bg-white px-3 py-2 rounded border"
                            >
                                {data.user.email}
                            </div>
                        </div>
                        {#if data.user.name}
                            <div>
                                <span
                                    class="block text-sm font-medium text-gray-700 mb-1"
                                    >Nombre</span
                                >
                                <div
                                    class="text-sm text-gray-900 bg-white px-3 py-2 rounded border"
                                >
                                    {data.user.name}
                                </div>
                            </div>
                        {/if}
                        <div>
                            <span
                                class="block text-sm font-medium text-gray-700 mb-1"
                                >Fecha de registro</span
                            >
                            <div
                                class="text-sm text-gray-900 bg-white px-3 py-2 rounded border"
                            >
                                {new Date(
                                    data.user.created_at,
                                ).toLocaleDateString("es-ES")}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Campos editables -->
                <div>
                    <label
                        for="role"
                        class="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Rol *
                    </label>
                    <select
                        id="role"
                        name="role"
                        value={data.user.role}
                        required
                        class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        {#each roleOptions as option}
                            <option
                                value={option.value}
                                selected={data.user.role === option.value}
                            >
                                {option.label}
                            </option>
                        {/each}
                    </select>
                    <p class="text-xs text-gray-500 mt-1">
                        Los administradores tienen acceso completo al panel de
                        administración.
                    </p>
                </div>
            </div>

            <div class="flex justify-end space-x-4 mt-8">
                <Button
                    variant="ghost"
                    label="Cancelar"
                    onclick={handleCancel}
                />
                <Button type="submit" label="Actualizar Usuario" />
            </div>
        </form>
    </div>
</div>
