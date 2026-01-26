<script lang="ts">
  import { onMount } from "svelte";
  import ButtonWithIcon from "$lib/components/atoms/button/ButtonWithIcon.svelte";
  import Card from "$lib/components/molecules/card/Card.svelte";
  import { timeAgo } from "$lib/utils/index.js";

  export let data;
  let user = data.user;
  let isAdmin = user.role === "admin";
  let editingProfile = false;
  let editingRole = false;

  // Roles disponibles
  const availableRoles = [
    {
      id: "admin",
      name: "Administrador",
      description: "Acceso completo al sistema",
    },
    {
      id: "editor",
      name: "Editor",
      description: "Puede crear y editar contenido",
    },
    { id: "viewer", name: "Visor", description: "Solo puede ver contenido" },
    {
      id: "user",
      name: "Usuario",
      description: "Acceso limitado a funcionalidades básicas",
    },
  ];

  // Preferencias
  let preferences = {
    notifications: true,
    darkMode: false,
    language: "es",
    timezone: "America/Bogota",
  };

  // Datos temporales para edición
  let tempUserData = { ...user };
  let tempPreferences = { ...preferences };
  let selectedRole = user.role;

  // Guardar cambios
  function saveProfile() {
    user = { ...tempUserData };
    editingProfile = false;
    // Aquí iría la lógica para guardar en el backend
  }

  function saveRole() {
    user.role = selectedRole;
    editingRole = false;
    // Aquí iría la lógica para guardar en el backend
  }

  function savePreferences() {
    preferences = { ...tempPreferences };
    // Aquí iría la lógica para guardar en el backend
  }

  // Cancelar edición
  function cancelEdit() {
    tempUserData = { ...user };
    editingProfile = false;
  }

  function cancelRoleEdit() {
    selectedRole = user.role;
    editingRole = false;
  }

  $: if (user) {
    tempUserData = { ...user };
    selectedRole = user.role;
  }

  $: if (preferences) {
    tempPreferences = { ...preferences };
  }


  let userAvatar = user.avatar?.trim()
    ? user.avatar
    : "https://placehold.co/150";
</script>

<section
  class="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-4 md:p-8"
>
  <div class="max-w-6xl mx-auto">
    <header class="mb-8">
      <h1 class="text-3xl md:text-4xl font-bold text-gray-800">
        Panel de Configuración
      </h1>
      <p class="text-gray-600 mt-2">
        Gestiona tu cuenta y configura las preferencias del sistema
      </p>

      {#if isAdmin}
        <div
          class="inline-flex items-center mt-4 px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium"
        >
          <svg
            class="w-4 h-4 mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clip-rule="evenodd"
            ></path>
          </svg>
          Modo Administrador
        </div>
      {/if}
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-1 space-y-6">
        <Card
          title="Foto de Perfil"
          content="Actualiza tu foto para que otros usuarios te reconozcan"
          class="h-auto"
        >
          <div class="flex flex-col items-center p-4">
            <div class="relative mb-6">
              <img
                src={userAvatar}
                alt="Foto de Perfil"
                class="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <div
                class="absolute bottom-2 right-2 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600 transition"
              >
                <svg
                  class="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                  ></path>
                </svg>
              </div>
            </div>

            <div class="w-full space-y-4">
              <ButtonWithIcon
                label="Cambiar Foto"
                variant="primary"
                class="w-full justify-center"
              />
              <ButtonWithIcon
                label="Eliminar Foto"
                variant="default"
                class="w-full justify-center text-gray-600 border-gray-300"
              />
            </div>

            <div class="mt-6 pt-6 border-t border-gray-200 w-full">
              <h3 class="font-medium text-gray-700 mb-2">
                Información de la cuenta
              </h3>
              <div class="flex justify-between text-sm text-gray-600">
                <span>Miembro desde</span>
                <span class="font-medium"
                  >{new Date(user.created_at).toLocaleDateString()}</span
                >
              </div>
              <div class="flex justify-between text-sm text-gray-600 mt-1">
                <span>Última actualización</span>
                <span class="font-medium">
                  {timeAgo(new Date(user.updated_at))}
                </span>
              </div>
            </div>
          </div>
        </Card>

        <Card
          title="Verificación de Cuenta"
          content="Aumenta la seguridad de tu cuenta"
        >
          <div class="space-y-4 p-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div
                  class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3"
                >
                  <svg
                    class="w-4 h-4 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </div>
                <div>
                  <p class="font-medium">Correo verificado</p>
                  <p class="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
            </div>

            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div
                  class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3"
                >
                  <svg
                    class="w-4 h-4 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <p class="font-medium">Autenticación 2FA</p>
                  <p class="text-sm text-gray-500">No activada</p>
                </div>
              </div>
              <ButtonWithIcon label="Activar" variant="default" size="small" />
            </div>
          </div>
        </Card>
      </div>

      <!-- Columna derecha: Información y configuraciones -->
      <div class="lg:col-span-2 space-y-6">
        <Card
          title="Información Personal"
          content={editingProfile
            ? "Modifica tu información personal"
            : "Aquí puedes ver tu información personal"}
          class="h-auto"
        >
          <div class="p-4">
            {#if editingProfile}
              <!-- Formulario de edición -->
              <div class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      for="name"
                      class="block text-sm font-medium text-gray-700 mb-1"
                      >Nombre completo</label
                    >
                    <input
                      type="text"
                      bind:value={tempUserData.user_metadata.display_name}
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label
                      for="email"
                      class="block text-sm font-medium text-gray-700 mb-1"
                      >Correo electrónico</label
                    >
                    <input
                      type="email"
                      bind:value={tempUserData.email}
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label
                    for="phone"
                    class="block text-sm font-medium text-gray-700 mb-1"
                    >Teléfono</label
                  >
                  <input
                    type="tel"
                    id="phone"
                    bind:value={tempUserData.phone}
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label
                    for="address"
                    class="block text-sm font-medium text-gray-700 mb-1"
                    >Dirección</label
                  >
                  <textarea
                    bind:value={tempUserData.address}
                    rows="2"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  ></textarea>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      for="language"
                      class="block text-sm font-medium text-gray-700 mb-1"
                      >Idioma preferido</label
                    >
                    <select
                      bind:value={tempUserData.language}
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Español">Español</option>
                      <option value="Inglés">Inglés</option>
                      <option value="Portugués">Portugués</option>
                      <option value="Francés">Francés</option>
                    </select>
                  </div>
                  <div>
                    <label
                      for="timezone"
                      class="block text-sm font-medium text-gray-700 mb-1"
                      >Zona horaria</label
                    >
                    <select
                      bind:value={tempUserData.timezone}
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="GMT-5">GMT-5 (Bogotá, Lima)</option>
                      <option value="GMT-6">GMT-6 (Ciudad de México)</option>
                      <option value="GMT-3">GMT-3 (Buenos Aires)</option>
                      <option value="GMT+0">GMT+0 (Londres)</option>
                    </select>
                  </div>
                </div>

                <div
                  class="flex justify-end space-x-3 pt-4 border-t border-gray-200"
                >
                  <ButtonWithIcon
                    iconButton="Ban"
                    onclick={cancelEdit}
                    label=" Cancelar"
                    variant="default"
                  />
                  <ButtonWithIcon
                    iconButton="Save"
                    label=" Guardar"
                    onclick={saveProfile}
                  />
                </div>
              </div>
            {:else}
              <!-- Vista de información -->
              <div class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p class="text-sm text-gray-500">Nombre completo</p>
                    <p class="font-medium">{user.user_metadata.display_name}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">Correo electrónico</p>
                    <p class="font-medium">{user.email}</p>
                  </div>
                </div>

                <div>
                  <p class="text-sm text-gray-500">Teléfono</p>
                  <p class="font-medium">{user.phone || "No especificado"}</p>
                </div>

                <div>
                  <p class="text-sm text-gray-500">Dirección</p>
                  <p class="font-medium">{user.address || "No especificada"}</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p class="text-sm text-gray-500">Idioma preferido</p>
                    <p class="font-medium">
                      {user.user_metadata.language || "No especificado"}
                    </p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">Zona horaria</p>
                    <p class="font-medium">
                      {user.user_metadata.timezone || "No especificada"}
                    </p>
                  </div>
                </div>

                <div class="flex justify-end pt-4 border-t border-gray-200">
                  <ButtonWithIcon
                    onclick={() => (editingProfile = true)}
                    label="Editar información"
                    variant="primary"
                  />
                </div>
              </div>
            {/if}
          </div>
        </Card>

        <!-- Gestión de roles (solo visible para administradores) -->
        {#if isAdmin}
          <Card
            title="Gestión de Roles"
            content={editingRole
              ? "Asigna o modifica el rol de usuario"
              : "Gestiona los permisos y roles de usuario"}
            class="border-l-4 border-l-purple-500"
          >
            <div class="p-4">
              {#if editingRole}
                <!-- Editor de roles -->
                <div class="space-y-6">
                  <div>
                    <label
                      for="role"
                      class="block text-sm font-medium text-gray-700 mb-3"
                      >Selecciona un rol para este usuario</label
                    >
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {#each availableRoles as role}
                        <div
                          role="button"
                          class={`border rounded-lg p-4 cursor-pointer transition ${selectedRole === role.id ? "border-purple-500 bg-purple-50" : "border-gray-200 hover:border-gray-300"}`}
                          on:click={() => (selectedRole = role.id)}
                        >
                          <div class="flex items-center">
                            <div
                              class={`w-4 h-4 rounded-full border flex items-center justify-center mr-3 ${selectedRole === role.id ? "border-purple-500 bg-purple-500" : "border-gray-300"}`}
                            >
                              {#if selectedRole === role.id}
                                <svg
                                  class="w-2 h-2 text-white"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    fill-rule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clip-rule="evenodd"
                                  ></path>
                                </svg>
                              {/if}
                            </div>
                            <div>
                              <h3 class="font-medium">{role.name}</h3>
                              <p class="text-sm text-gray-500 mt-1">
                                {role.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      {/each}
                    </div>
                  </div>

                  <div class="bg-gray-50 p-4 rounded-lg">
                    <h3 class="font-medium text-gray-700 mb-2">
                      Permisos del rol seleccionado
                    </h3>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {#if selectedRole === "admin"}
                        <span
                          class="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded"
                          >Todos los permisos</span
                        >
                        <span
                          class="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded"
                          >Gestionar usuarios</span
                        >
                        <span
                          class="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded"
                          >Modificar configuración</span
                        >
                        <span
                          class="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded"
                          >Acceso completo</span
                        >
                      {:else if selectedRole === "editor"}
                        <span
                          class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                          >Crear contenido</span
                        >
                        <span
                          class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                          >Editar contenido</span
                        >
                        <span
                          class="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                          >Gestionar usuarios</span
                        >
                        <span
                          class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                          >Subir archivos</span
                        >
                      {:else if selectedRole === "viewer"}
                        <span
                          class="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded"
                          >Ver contenido</span
                        >
                        <span
                          class="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                          >Crear contenido</span
                        >
                        <span
                          class="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                          >Editar contenido</span
                        >
                        <span
                          class="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                          >Gestionar usuarios</span
                        >
                      {:else}
                        <span
                          class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                          >Ver contenido</span
                        >
                        <span
                          class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                          >Comentar</span
                        >
                        <span
                          class="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                          >Crear contenido</span
                        >
                        <span
                          class="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                          >Editar contenido</span
                        >
                      {/if}
                    </div>
                  </div>

                  <div
                    class="flex justify-end space-x-3 pt-4 border-t border-gray-200"
                  >
                    <button
                      on:click={cancelRoleEdit}
                      class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                    >
                      Cancelar
                    </button>
                    <button
                      on:click={saveRole}
                      class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                    >
                      Guardar rol
                    </button>
                  </div>
                </div>
              {:else}
                <!-- Vista de roles -->
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-sm text-gray-500">Rol actual</p>
                      <div class="flex items-center mt-1">
                        <div
                          class="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium"
                        >
                          {#if user.role === "admin"}
                            Administrador
                          {:else if user.role === "editor"}
                            Editor
                          {:else if user.role === "viewer"}
                            Visor
                          {:else}
                            Usuario
                          {/if}
                        </div>
                        <span class="ml-3 text-gray-600 text-sm">
                          {#each availableRoles as role}
                            {#if role.id === user.role}
                              {role.description}
                            {/if}
                          {/each}
                        </span>
                      </div>
                    </div>

                    <ButtonWithIcon
                      onclick={() => (editingRole = true)}
                      label="Cambiar rol"
                      variant="primary"
                    />
                  </div>

                  <div class="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <div class="flex">
                      <svg
                        class="w-5 h-5 text-blue-500 mr-2 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                      <div>
                        <p class="font-medium text-blue-800">
                          Modo Administrador Activado
                        </p>
                        <p class="text-sm text-blue-600 mt-1">
                          Como administrador, puedes gestionar roles de usuario,
                          permisos y configuraciones del sistema.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              {/if}
            </div>
          </Card>
        {/if}

        <!-- Preferencias del sistema -->
        <Card
          title="Preferencias del Sistema"
          content="Personaliza la experiencia de usuario según tus necesidades"
        >
          <div class="p-4">
            <div class="space-y-4">
              <div
                class="flex items-center justify-between py-3 border-b border-gray-100"
              >
                <div>
                  <p class="font-medium">Notificaciones por correo</p>
                  <p class="text-sm text-gray-500">
                    Recibe notificaciones sobre actividad en tu cuenta
                  </p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    bind:checked={tempPreferences.notifications}
                    class="sr-only peer"
                  />
                  <div
                    class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
                  ></div>
                </label>
              </div>

              <div
                class="flex items-center justify-between py-3 border-b border-gray-100"
              >
                <div>
                  <p class="font-medium">Modo oscuro</p>
                  <p class="text-sm text-gray-500">
                    Activa el tema oscuro para una mejor experiencia visual
                  </p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    bind:checked={tempPreferences.darkMode}
                    class="sr-only peer"
                  />
                  <div
                    class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
                  ></div>
                </label>
              </div>

              <div class="py-3">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      for="language"
                      class="block text-sm font-medium text-gray-700 mb-1"
                      >Idioma de la interfaz</label
                    >
                    <select
                      bind:value={tempPreferences.language}
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="es">Español</option>
                      <option value="en">English</option>
                      <option value="pt">Português</option>
                      <option value="fr">Français</option>
                    </select>
                  </div>
                  <div>
                    <label
                      for="timezone"
                      class="block text-sm font-medium text-gray-700 mb-1"
                      >Zona horaria del sistema</label
                    >
                    <select
                      bind:value={tempPreferences.timezone}
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="America/Bogota">Bogotá (GMT-5)</option>
                      <option value="America/Mexico_City"
                        >Ciudad de México (GMT-6)</option
                      >
                      <option value="America/Argentina/Buenos_Aires"
                        >Buenos Aires (GMT-3)</option
                      >
                      <option value="Europe/London">Londres (GMT+0)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div class="flex justify-end pt-4 border-t border-gray-200">
                <ButtonWithIcon
                  onclick={savePreferences}
                  label="Guardar preferencias"
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>

    <!-- Pie de página con acciones -->
    <div
      class="mt-8 pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center"
    >
      <div class="text-sm text-gray-500 mb-4 md:mb-0">
        <p>Última actualización: 15 de Noviembre, 2023</p>
      </div>
      <div class="flex space-x-3">
        <ButtonWithIcon label="Exportar datos" variant="default" />
        <ButtonWithIcon label="Descargar respaldo" variant="default" />
        {#if isAdmin}
          <ButtonWithIcon label="Configuración avanzada" variant="primary" />
        {/if}
      </div>
    </div>
  </div>
</section>

<style>
  /* Transiciones suaves para elementos interactivos */
  button,
  label,
  input,
  select,
  textarea {
    transition: all 0.2s ease;
  }

  /* Mejora visual para las tarjetas */
  .card-hover {
    transition:
      transform 0.3s ease,
      box-shadow 0.3s ease;
  }

  .card-hover:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  }
</style>
