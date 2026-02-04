<script lang="ts">
    import {
        Button,
        ButtonWithIcon,
        ButtonWithLoading,
        Card,
        Alert,
        Icon,
        PageHeader,
    } from "$lib/components";
    import { ROLE_LABELS, type Role } from "$lib/types/roles";
    import { themeState } from "$lib/stores/theme.svelte";
    import { onMount } from "svelte";
    import { createMutation } from "@tanstack/svelte-query";
    import * as rpc from "$lib/query";

    let { data } = $props();

    let user = $state(data.user);
    let editingProfile = $state(false);

    let alertMessage = $state<{
        type: "success" | "error";
        message: string;
    } | null>(null);

    // File input reference
    let fileInput: HTMLInputElement;

    // Datos temporales para edición
    let tempDisplayName = $state(user.user_metadata?.display_name || "");
    let tempPhone = $state(user.phone || "");

    // Preferencias
    let preferences = $state({
        notifications: true,
        language: "es",
        timezone: "America/Bogota",
    });

    // Dark mode from store
    let isDarkMode = $derived(themeState.current === "dark");

    onMount(() => {
        themeState.init();
    });

    function toggleDarkMode() {
        themeState.toggle();
    }

    // Avatar URL
    let avatarUrl = $derived(
        user.user_metadata?.avatar_url ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(user.user_metadata?.display_name || user.email || "U")}&background=6366f1&color=fff&size=150`,
    );

    // Mutations
    const uploadAvatarMutation = createMutation(
        () => rpc.profile.updates.uploadAvatar.options,
    );
    const removeAvatarMutation = createMutation(
        () => rpc.profile.updates.removeAvatar.options,
    );
    const updateProfileMutation = createMutation(
        () => rpc.profile.updates.updateProfile.options,
    );

    // Loading states derived from mutations
    let isUploading = $derived(
        uploadAvatarMutation.isPending || removeAvatarMutation.isPending,
    );
    let isSaving = $derived(updateProfileMutation.isPending);

    // Handle file selection
    async function handleFileSelect(event: Event) {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];

        if (!file) return;

        // Validate file type
        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/webp",
        ];
        if (!allowedTypes.includes(file.type)) {
            alertMessage = {
                type: "error",
                message:
                    "Tipo de archivo no permitido. Use JPEG, PNG, GIF o WEBP.",
            };
            return;
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            alertMessage = {
                type: "error",
                message: "El archivo es muy grande. Máximo 5MB.",
            };
            return;
        }

        alertMessage = null;
        uploadAvatarMutation.mutate(file, {
            onSuccess: (data) => {
                user.user_metadata = {
                    ...user.user_metadata,
                    avatar_url: data.avatarUrl,
                };
                alertMessage = {
                    type: "success",
                    message: "Foto de perfil actualizada correctamente.",
                };
            },
            onError: (error) => {
                alertMessage = {
                    type: "error",
                    message: error.message || "Error al subir la foto.",
                };
            },
        });
    }

    function triggerFileInput() {
        fileInput?.click();
    }

    function removeAvatar() {
        alertMessage = null;
        removeAvatarMutation.mutate(undefined, {
            onSuccess: () => {
                user.user_metadata = {
                    ...user.user_metadata,
                    avatar_url: null,
                };
                alertMessage = {
                    type: "success",
                    message: "Foto de perfil eliminada.",
                };
            },
            onError: (error) => {
                alertMessage = {
                    type: "error",
                    message: error.message || "Error al eliminar la foto.",
                };
            },
        });
    }

    function saveProfile() {
        alertMessage = null;
        updateProfileMutation.mutate(
            {
                display_name: tempDisplayName,
                phone: tempPhone,
            },
            {
                onSuccess: () => {
                    user.user_metadata = {
                        ...user.user_metadata,
                        display_name: tempDisplayName,
                    };
                    user.phone = tempPhone;
                    editingProfile = false;
                    alertMessage = {
                        type: "success",
                        message: "Información actualizada correctamente.",
                    };
                },
                onError: (error) => {
                    alertMessage = {
                        type: "error",
                        message: error.message || "Error al guardar.",
                    };
                },
            },
        );
    }

    function cancelEdit() {
        tempDisplayName = user.user_metadata?.display_name || "";
        tempPhone = user.phone || "";
        editingProfile = false;
    }

    async function savePreferences() {
        alertMessage = { type: "success", message: "Preferencias guardadas." };
    }

    function formatDate(dateString: string | undefined) {
        if (!dateString) return "No disponible";
        return new Date(dateString).toLocaleDateString("es-CO", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    }

    function getRoleLabel(role: Role): string {
        return ROLE_LABELS[role] || role;
    }
</script>

<section
    class="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-4 md:p-8"
>
    <div class="max-w-5xl mx-auto">
        <PageHeader
            title="Mi Perfil"
            subtitle="Gestiona tu información personal y preferencias"
            icon="User"
        />

        {#if alertMessage}
            <div class="mb-6">
                <Alert
                    type={alertMessage.type}
                    message={alertMessage.message}
                />
            </div>
        {/if}

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Columna izquierda: Foto y resumen -->
            <div class="lg:col-span-1 space-y-6">
                <!-- Foto de perfil -->
                <Card title="Foto de Perfil">
                    <div class="flex flex-col items-center p-6">
                        <div class="relative mb-6">
                            <img
                                src={avatarUrl}
                                alt="Foto de Perfil"
                                class="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                            />
                            {#if isUploading}
                                <div
                                    class="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center"
                                >
                                    <Icon
                                        name="Loader2"
                                        size={32}
                                        className="text-white animate-spin"
                                    />
                                </div>
                            {:else}
                                <button
                                    type="button"
                                    onclick={triggerFileInput}
                                    class="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full shadow-lg hover:bg-primary-700 transition-colors"
                                >
                                    <Icon name="Camera" size={18} />
                                </button>
                            {/if}
                        </div>

                        <input
                            bind:this={fileInput}
                            type="file"
                            accept="image/jpeg,image/png,image/gif,image/webp"
                            onchange={handleFileSelect}
                            class="hidden"
                        />

                        <div class="w-full space-y-2">
                            <ButtonWithLoading
                                label="Cambiar Foto"
                                variant="primary"
                                loading={isUploading}
                                onclick={triggerFileInput}
                                class="w-full"
                            />
                            {#if user.user_metadata?.avatar_url}
                                <Button
                                    label="Eliminar Foto"
                                    variant="secondary"
                                    onclick={removeAvatar}
                                    disabled={isUploading}
                                    class="w-full"
                                />
                            {/if}
                        </div>

                        <p class="text-xs text-gray-500 mt-3 text-center">
                            JPG, PNG, GIF o WEBP. Máximo 5MB.
                        </p>
                    </div>
                </Card>

                <!-- Información de cuenta -->
                <Card title="Información de Cuenta">
                    <div class="p-4 space-y-3">
                        <div class="flex justify-between items-center">
                            <span class="text-sm text-gray-500">Rol</span>
                            <span
                                class="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium"
                            >
                                {getRoleLabel(user.role)}
                            </span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-sm text-gray-500"
                                >Miembro desde</span
                            >
                            <span class="text-sm font-medium"
                                >{formatDate(user.created_at)}</span
                            >
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-sm text-gray-500"
                                >Email verificado</span
                            >
                            <span
                                class="flex items-center gap-1 text-green-600"
                            >
                                <Icon name="CheckCircle" size={16} />
                                <span class="text-sm">Sí</span>
                            </span>
                        </div>
                    </div>
                </Card>
            </div>

            <!-- Columna derecha: Información y preferencias -->
            <div class="lg:col-span-2 space-y-6">
                <!-- Información personal -->
                <Card
                    title="Información Personal"
                    content={editingProfile
                        ? "Edita tu información"
                        : "Tu información de contacto"}
                >
                    <div class="p-4">
                        {#if editingProfile}
                            <div class="space-y-4">
                                <div
                                    class="grid grid-cols-1 md:grid-cols-2 gap-4"
                                >
                                    <div>
                                        <label
                                            for="display-name"
                                            class="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Nombre completo
                                        </label>
                                        <input
                                            id="display-name"
                                            type="text"
                                            bind:value={tempDisplayName}
                                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                        />
                                    </div>
                                    <div>
                                        <label
                                            for="email"
                                            class="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Correo electrónico
                                        </label>
                                        <input
                                            id="email"
                                            type="email"
                                            value={user.email}
                                            disabled
                                            class="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                                        />
                                        <p class="text-xs text-gray-500 mt-1">
                                            El email no se puede modificar
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <label
                                        for="phone"
                                        class="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Teléfono
                                    </label>
                                    <input
                                        id="phone"
                                        type="tel"
                                        bind:value={tempPhone}
                                        placeholder="+57 300 123 4567"
                                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    />
                                </div>

                                <div
                                    class="flex justify-end gap-3 pt-4 border-t border-gray-200"
                                >
                                    <Button
                                        label="Cancelar"
                                        variant="secondary"
                                        onclick={cancelEdit}
                                        disabled={isSaving}
                                    />
                                    <ButtonWithLoading
                                        label="Guardar cambios"
                                        variant="primary"
                                        loading={isSaving}
                                        onclick={saveProfile}
                                    />
                                </div>
                            </div>
                        {:else}
                            <div class="space-y-4">
                                <div
                                    class="grid grid-cols-1 md:grid-cols-2 gap-4"
                                >
                                    <div>
                                        <p class="text-sm text-gray-500">
                                            Nombre completo
                                        </p>
                                        <p class="font-medium">
                                            {user.user_metadata?.display_name ||
                                                "No especificado"}
                                        </p>
                                    </div>
                                    <div>
                                        <p class="text-sm text-gray-500">
                                            Correo electrónico
                                        </p>
                                        <p class="font-medium">{user.email}</p>
                                    </div>
                                </div>

                                <div>
                                    <p class="text-sm text-gray-500">
                                        Teléfono
                                    </p>
                                    <p class="font-medium">
                                        {user.phone || "No especificado"}
                                    </p>
                                </div>

                                <div
                                    class="flex justify-end pt-4 border-t border-gray-200"
                                >
                                    <ButtonWithIcon
                                        iconButton="Pencil"
                                        label="Editar información"
                                        variant="primary"
                                        onclick={() => (editingProfile = true)}
                                    />
                                </div>
                            </div>
                        {/if}
                    </div>
                </Card>

                <!-- Preferencias -->
                <Card title="Preferencias" content="Personaliza tu experiencia">
                    <div class="p-4 space-y-4">
                        <div
                            class="flex items-center justify-between py-3 border-b border-gray-100"
                        >
                            <div>
                                <p class="font-medium">
                                    Notificaciones por correo
                                </p>
                                <p class="text-sm text-gray-500">
                                    Recibe alertas sobre tu cuenta
                                </p>
                            </div>
                            <label
                                class="relative inline-flex items-center cursor-pointer"
                            >
                                <input
                                    type="checkbox"
                                    bind:checked={preferences.notifications}
                                    class="sr-only peer"
                                />
                                <div
                                    class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"
                                ></div>
                            </label>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 py-3">
                            <div>
                                <label
                                    for="language"
                                    class="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Idioma
                                </label>
                                <select
                                    id="language"
                                    bind:value={preferences.language}
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                >
                                    <option value="es">Español</option>
                                    <option value="en">English</option>
                                </select>
                            </div>
                            <div>
                                <label
                                    for="timezone"
                                    class="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Zona horaria
                                </label>
                                <select
                                    id="timezone"
                                    bind:value={preferences.timezone}
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                >
                                    <option value="America/Bogota"
                                        >Bogotá (GMT-5)</option
                                    >
                                    <option value="America/Mexico_City"
                                        >Ciudad de México (GMT-6)</option
                                    >
                                    <option value="America/Lima"
                                        >Lima (GMT-5)</option
                                    >
                                </select>
                            </div>
                        </div>

                        <div
                            class="flex justify-end pt-4 border-t border-gray-200"
                        >
                            <Button
                                label="Guardar preferencias"
                                variant="primary"
                                onclick={savePreferences}
                            />
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    </div>
</section>
