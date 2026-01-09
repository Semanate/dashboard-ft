<script lang="ts">
  import ButtonWithIcon from "$lib/components/atoms/button/ButtonWithIcon.svelte";
  import { createDataTable } from "$lib/components/organisms/data-table/DataTable.headless.svelte";
  import DataTable from "$lib/components/organisms/data-table/DataTable.svelte";
  import type { FormDataType } from "$lib/types";
  import { onMount } from "svelte";

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
      console.log(res, "LOAD FORMS RESPONSE");
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

  async function generateExcel(data) {
    // const formData = await getSarlaftById(data.id);
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

  async function deleteForm(data) {
    console.log("Deleting form with ID:", data.id);
    // Implement deletion logic here
    const res = await fetch("/sarlaft", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: data.id }),
    });
  }

  const columns = [
    { label: "ID", key: "id" },
    { label: "Estado", key: "status" },
    { label: "Tipo de Persona", key: "type_person_agreement" },
    { label: "Nombre Solicitante", key: "naturalPerson.firstName" },
    { label: "Número de Documento", key: "naturalPerson.docNumber" },
    { label: "Fecha de Creación", key: "created_at" },
    { label: "Última Actualización", key: "updated_at" },
  ];

  const rows = $derived(
    FormList.map((f: any) => ({
      ...f,
      updated_at: new Date(f.updated_at).toLocaleString(),
      created_at: new Date(f.created_at).toLocaleString(),
    })),
  );

  const table = $derived(createDataTable(rows, columns));
</script>

<section class="prose max-w-full h-full overflow-y-auto overflow-x-hidden p-4">
  <div class="prose max-w-full h-full overflow-y-auto overflow-x-hidden p-4">
    <div class="mb-6 flex flex-wrap gap-4 items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 mb-2">
          Lista de Formularios SARLAFT
        </h1>
        <p class="text-gray-600">
          Sistema de Administración del Riesgo de Lavado de Activos y de la
          Financiación del Terrorismo
        </p>
      </div>

      <div class="flex gap-2">
        <ButtonWithIcon
          label="Crear"
          iconButton="Upload"
          variant="secondary"
          size="medium"
          onclick={() => (window.location.href = "/sarlaft/create")}
        />

        <ButtonWithIcon
          label="Recargar"
          iconButton="RefreshCcw"
          variant="primary"
          size="medium"
          onclick={() => {
            console.log("Recargando formularios...", rows);
          }}
        />
      </div>
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
            {
              iconName: "Download",
              iconClass: "text-blue-300/80",
              onclick: (row) => {
                generateExcel(row);
              },
            },
            {
              iconName: "Delete",
              iconClass: "text-red-300/80",
              onclick: (row) => {
                deleteForm(row);
              },
            },
          ]}
        />
      </article>
    </div>
  </div>
</section>
