<script lang="ts">
  import CategoryForm from "$lib/components/organisms/category-form/CategoryForm.svelte";
  async function descargar() {
    const rest = await fetch("/excel");
    const { data } = await rest.json();
    console.log(data);
    // const blob = await res.blob();
    // const url = URL.createObjectURL(blob);

    // const a = document.createElement("a");
    // a.href = url;
    // a.download = "SARLAFT.xlsx";
    // a.click();
  }

  let form = {
    date: "2023-10-10",
    city: "asdasd",
    typeDocument: "asdasd",
    representative: {
      firstName: "test",
      lastName1: "asdasd",
      lastName2: "asdasd",
      phone: "aasdasd",
      email: "asdasd",
      typeDoc: "CC",
      docNumber: "123456789",
      city: "asdsad",
      activitySector: "asdasd",
      address: "asdasdsad",
    },
    naturalPerson: {
      typeDoc: "CC",
      docNumber: "123456789",
      firstName: "test",
      lastName1: "asdasd",
      activitySector: "asdasd",
      lastName2: "asdasd",
      phone: "aasdasd",
      email: "asdasd",
      city: "asdsad",
      address: "asdasdsad",
      dateOfBirth: "1990-01-01",
      placeOfBirth: "asdasd",
    },
    juridicalPerson: {
      businessName: "asdasd",
      nit: "123456789",
      phone: "aasdasd",
      email: "asdasd",
      email2: "asdasd",
      city: "asdsad",
      phone2: "aasdasd",
      address: "asdasdsad",
      address2: "asdasdsad",
      activitySector: "asdasd",
    },
  };

  async function generateExcel() {
    const res = await fetch("/excel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "Formulario_Llenado.xlsx";
    a.click();
  }
</script>

<section class="prose max-w-full">
  <h1>Signature Pad Component</h1>
  <p>
    This component allows users to draw their signature on a canvas. It supports
    mouse and touch inputs, and provides options to clear the canvas.
  </p>

  <CategoryForm
    categories={[
      {
        label: "Category 1",
        fields: [
          {
            id: "fieldA",
            label: "Field A",
            type: "text",
            name: "fieldA",
            value: "",
          },
          {
            id: "fieldB",
            label: "Field B",
            type: "textarea",
            name: "fieldB",
            value: "",
          },
        ],
      },
      {
        label: "Category 2",
        fields: [
          {
            id: "fieldC",
            label: "Field C",
            type: "text",
            name: "fieldC",
            value: "",
          },
          {
            id: "fieldD",
            label: "Field D",
            type: "date",
            name: "fieldD",
            value: "",
          },
        ],
      },
    ]}
  /><button on:click={descargar}> Descargar Excel SARLAFT </button>
  <button on:click={generateExcel}> Generar Excel Llenado </button>
</section>
