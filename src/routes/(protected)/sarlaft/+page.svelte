<script lang="ts">
  import { ButtonWithIcon, PageHeader, Button, Modal, Icon } from "$lib/components";
  import { createDataTable } from "$lib/components/organisms/data-table/DataTable.headless.svelte";
  import DataTable from "$lib/components/organisms/data-table/DataTable.svelte";
  import type { FormDataType } from "$lib/types";
  import { onMount } from "svelte";
  import { page } from "$app/state";
  import { createDynamicPermissionChecker } from "$lib/utils/permissions";
  import { ROLES, type Role } from "$lib/types/roles";

  let permissions = $derived(
    createDynamicPermissionChecker(
      (page.data.user?.role as Role) ?? ROLES.USER,
      (page.data.userPermissions as string[]) ?? [],
    ),
  );

  let FormList: FormDataType[] = $state([]);
  
  // Delete confirmation modal state
  let showDeleteModal = $state(false);
  let formToDelete = $state<FormDataType | null>(null);
  let isDeleting = $state(false);

  async function loadForms() {
    try {
      const response = await fetch("/sarlaft", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const res = await response.json();
      if (res.success) {
        FormList = res.data.items || [];
      }
    } catch (error) {
      console.error("Error loading forms:", error);
    }
  }

  onMount(() => {
    loadForms();
  });

  async function generateExcel(data: FormDataType) {
    const res = await fetch("/excel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: data.id }),
    });

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "Formulario_Llenado.xlsx";
    a.click();
  }

  function openDeleteModal(data: FormDataType) {
    formToDelete = data;
    showDeleteModal = true;
  }

  function closeDeleteModal() {
    showDeleteModal = false;
    formToDelete = null;
  }

  async function confirmDelete() {

    if (!formToDelete) return;
    
    isDeleting = true;
    try {
      const res = await fetch("/sarlaft", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: formToDelete.id }),
      });

      console.log("Delete response:", res);
      if (res.ok) {
        await loadForms();
      }
    } catch (error) {
      console.error("Error deleting form:", error);
    } finally {
      isDeleting = false;
      closeDeleteModal();
    }
  }

  const columns = [
    { label: "ID", key: "id" },
    { label: "Estado", key: "status" },
    { label: "Tipo de Persona", key: "typePersonAggrement" },
    { label: "Nombre Solicitante", key: "firstName" },
    { label: "Número de Documento", key: "docNumber" },
    { label: "Fecha de Creación", key: "created_at" },
    { label: "Última Actualización", key: "updated_at" },
  ];

  const rows = $derived(
    FormList.map((f: any) => ({
      id: f.id,
      status: f.status === "draft" ? "Borrador" : "Enviado",
      firstName:
        f.typePersonAggrement === "NAT"
          ? (f.naturalPerson?.firstName ?? "N/A")
          : (f.juridicalPerson?.businessName ?? "N/A"),

      docNumber:
        f.typePersonAggrement === "NAT"
          ? (f.naturalPerson?.docNumber ?? "N/A")
          : (f.juridicalPerson?.docNumber ?? "N/A"),

      typePersonAggrement:
        f.typePersonAggrement === "NAT" ? "Natural" : "Jurídica",

      created_at: new Date(f.created_at).toLocaleString(),
      updated_at: new Date(f.updated_at).toLocaleString(),
    })),
  );

  const table = $derived(createDataTable(rows, columns));
</script>

<section class="prose max-w-full h-full overflow-y-auto overflow-x-hidden p-4">
  <div class="prose max-w-full h-full overflow-y-auto overflow-x-hidden p-4">
    <PageHeader
      title="Lista de Formularios SARLAFT"
      subtitle="Sistema de Administración del Riesgo de Lavado de Activos y de la Financiación del Terrorismo"
      icon="FileText"
    >
        {#if permissions.canCreateSarlaft}
          <ButtonWithIcon
            label="Crear"
            iconButton="Upload"
            variant="secondary"
            size="medium"
            onclick={() => (window.location.href = "/sarlaft/create")}
          />
        {/if}

        <ButtonWithIcon
          label="Recargar"
          iconButton="RefreshCcw"
          variant="primary"
          size="medium"
          onclick={() => {
            loadForms();
          }}
        />
    </PageHeader>
    <div class="mb-6 flex flex-wrap gap-4 items-center justify-between">
      <article class="w-full">
        <DataTable
          {table}
          actions={[
            {
              iconName: "Eye",
              iconClass: "text-green-300/80",
              onclick: (row) => {
                window.location.href = `/sarlaft/${row.id}`;
              },
            },
            ...(permissions.can("export_reports")
              ? [
                  {
                    iconName: "Download",
                    iconClass: "text-blue-300/80",
                    onclick: (row: any) => {
                      generateExcel(row);
                    },
                  },
                ]
              : []),
            ...(permissions.can("delete_sarlaft")
              ? [
                  {
                    iconName: "Trash2",
                    iconClass: "text-red-300/80",
                    onclick: (row: any) => {
                      openDeleteModal(row);
                    },
                  },
                ]
              : []),
          ]}
        />
      </article>
    </div>
  </div>
</section>

<!-- Delete Confirmation Modal -->
<Modal
  isOpen={showDeleteModal}
  onClose={closeDeleteModal}
  title="Eliminar Formulario"
  size="md"
>
  <div class="p-4">
    <div class="flex items-center gap-4 mb-4">
      <div class="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
        <Icon name="AlertTriangle" class="w-6 h-6 text-red-600" />
      </div>
      <div>
        <h3 class="text-lg font-semibold text-gray-900">¿Estás seguro?</h3>
        <p class="text-sm text-gray-500">Esta acción no se puede deshacer.</p>
      </div>
    </div>
    
    <p class="text-gray-700 mb-4">
      Estás a punto de eliminar el formulario 
      <span class="font-semibold">#{formToDelete?.id?.slice(0, 8)}...</span>
      junto con todos sus documentos asociados.
    </p>

    <div class="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
      <div class="flex gap-2">
        <Icon name="AlertCircle" class="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div class="text-sm text-amber-800">
          <p class="font-medium">Se eliminarán permanentemente:</p>
          <ul class="list-disc list-inside mt-1 space-y-0.5">
            <li>El formulario SARLAFT</li>
            <li>Todas las relaciones asociadas</li>
            <li>Los documentos adjuntos en el storage</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="flex justify-end gap-3">
      <Button
        variant="secondary"
        onclick={closeDeleteModal}
        disabled={isDeleting}
      >
        Cancelar
      </Button>
      <Button
        variant="danger"
        onclick={confirmDelete}
        disabled={isDeleting}
      >
        {#if isDeleting}
          Eliminando...
        {:else}
          Eliminar Formulario
        {/if}
      </Button>
    </div>
  </div>
</Modal>