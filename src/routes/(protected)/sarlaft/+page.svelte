<script lang="ts">
  import { ButtonWithIcon, PageHeader, Button } from "$lib/components";
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

  async function deleteForm(data: FormDataType) {
    const res = await fetch("/sarlaft", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: data.id }),
    });

    await loadForms();
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
                    iconName: "Delete",
                    iconClass: "text-red-300/80",
                    onclick: (row: any) => {
                      deleteForm(row);
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
