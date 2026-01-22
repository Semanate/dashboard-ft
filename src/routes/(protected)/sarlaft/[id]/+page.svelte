<script lang="ts">
    import ButtonWithIcon from "$lib/components/atoms/button/ButtonWithIcon.svelte";
    import type { SarlaftForm } from "$lib/types/sarlaft.js";

    export let data;

    const sarlaft: SarlaftForm = data.sarlaft;

    async function downloadPDF() {
        const res = await fetch("/pdf", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: sarlaft.id }),
        });

        if (!res.ok) {
            console.error("Error al generar el PDF");
            return;
        }

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `SARLAFT.pdf`;
        a.click();

        URL.revokeObjectURL(url);
    }
</script>

<section class="w-full mx-auto p-6 space-y-6">
    <!-- Header -->
    <header class="flex justify-between items-start">
        <div>
            <h1 class="text-2xl font-bold text-gray-900">Formulario SARLAFT</h1>
            <p class="text-gray-600">
                ID: {sarlaft.id}
            </p>
        </div>

        <div class="flex gap-2">
            <ButtonWithIcon
                label="Volver"
                iconButton="ArrowLeft"
                variant="secondary"
                onclick={() => history.back()}
            />

            <ButtonWithIcon
                label="Descargar PDF"
                iconButton="FileText"
                variant="primary"
                onclick={downloadPDF}
            />
        </div>
    </header>

    <!-- Información general -->
    <article class="bg-white rounded-xl border p-6 space-y-4">
        <h2 class="text-lg font-semibold text-gray-800">Información General</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
                <span class="text-gray-500">Estado</span>
                <p class="font-medium">{sarlaft.status}</p>
            </div>

            <div>
                <span class="text-gray-500">Tipo de Persona</span>
                <p class="font-medium">{sarlaft.typePersonAggrement}</p>
            </div>

            <div>
                <span class="text-gray-500">Fecha de creación</span>
                <p class="font-medium">
                    {new Date(sarlaft.created_at).toLocaleString()}
                </p>
            </div>

            <div>
                <span class="text-gray-500">Última actualización</span>
                <p class="font-medium">
                    {new Date(sarlaft.updated_at).toLocaleString()}
                </p>
            </div>
        </div>
    </article>

    {#if sarlaft.typePersonAggrement === "JUR" && sarlaft.juridicalPerson}
        <article class="bg-white rounded-xl border p-6 space-y-4">
            <h2 class="text-lg font-semibold text-gray-800">
                Persona Jurídica
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {#if sarlaft.juridicalPerson.businessName}
                    <div>
                        <span class="text-gray-500">Razón Social</span>
                        <p class="font-medium">
                            {sarlaft.juridicalPerson.businessName}
                        </p>
                    </div>
                {/if}

                {#if sarlaft.juridicalPerson.nit}
                    <div>
                        <span class="text-gray-500">NIT</span>
                        <p class="font-medium">{sarlaft.juridicalPerson.nit}</p>
                    </div>
                {/if}

                {#if sarlaft.juridicalPerson.activitySector}
                    <div>
                        <span class="text-gray-500">Actividad Económica</span>
                        <p class="font-medium">
                            {sarlaft.juridicalPerson.activitySector}
                        </p>
                    </div>
                {/if}

                {#if sarlaft.juridicalPerson.city}
                    <div>
                        <span class="text-gray-500">Ciudad</span>
                        <p class="font-medium">
                            {sarlaft.juridicalPerson.city}
                        </p>
                    </div>
                {/if}

                {#if sarlaft.juridicalPerson.address}
                    <div>
                        <span class="text-gray-500">Dirección</span>
                        <p class="font-medium">
                            {sarlaft.juridicalPerson.address}
                        </p>
                    </div>
                {/if}

                {#if sarlaft.juridicalPerson.phone}
                    <div>
                        <span class="text-gray-500">Teléfono</span>
                        <p class="font-medium">
                            {sarlaft.juridicalPerson.phone}
                        </p>
                    </div>
                {/if}

                {#if sarlaft.juridicalPerson.email}
                    <div>
                        <span class="text-gray-500">Correo</span>
                        <p class="font-medium">
                            {sarlaft.juridicalPerson.email}
                        </p>
                    </div>
                {/if}
            </div>
        </article>
    {/if}

    <!-- Persona Natural  -->
    {#if sarlaft.naturalPerson}
        <article class="bg-white rounded-xl border p-6 space-y-4">
            <h2 class="text-lg font-semibold text-gray-800">
                Datos del Solicitante
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                    <span class="text-gray-500">Nombre</span>
                    <p class="font-medium">
                        {sarlaft.naturalPerson.firstName}
                        {sarlaft.naturalPerson.lastName1}
                    </p>
                </div>

                <div>
                    <span class="text-gray-500">Documento</span>
                    <p class="font-medium">
                        {sarlaft.naturalPerson.typeDoc}
                        {sarlaft.naturalPerson.docNumber}
                    </p>
                </div>

                <div>
                    <span class="text-gray-500">Correo</span>
                    <p class="font-medium">
                        {sarlaft.naturalPerson.email}
                    </p>
                </div>

                <div>
                    <span class="text-gray-500">Teléfono</span>
                    <p class="font-medium">
                        {sarlaft.naturalPerson.phone}
                    </p>
                </div>
            </div>
        </article>
    {/if}

    {#if sarlaft.representative && (sarlaft.representative.firstName || sarlaft.representative.docNumber)}
        <article class="bg-white rounded-xl border p-6 space-y-4">
            <h2 class="text-lg font-semibold text-gray-800">
                Representante Legal
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {#if sarlaft.representative.firstName}
                    <div>
                        <span class="text-gray-500">Nombre</span>
                        <p class="font-medium">
                            {sarlaft.representative.firstName}
                            {sarlaft.representative.lastName1}
                            {sarlaft.representative.lastName2}
                        </p>
                    </div>
                {/if}

                {#if sarlaft.representative.typeDoc}
                    <div>
                        <span class="text-gray-500">Documento</span>
                        <p class="font-medium">
                            {sarlaft.representative.typeDoc}
                            {sarlaft.representative.docNumber}
                        </p>
                    </div>
                {/if}

                {#if sarlaft.representative.activitySector}
                    <div>
                        <span class="text-gray-500">Actividad Económica</span>
                        <p class="font-medium">
                            {sarlaft.representative.activitySector}
                        </p>
                    </div>
                {/if}

                {#if sarlaft.representative.city}
                    <div>
                        <span class="text-gray-500">Ciudad</span>
                        <p class="font-medium">{sarlaft.representative.city}</p>
                    </div>
                {/if}

                {#if sarlaft.representative.address}
                    <div>
                        <span class="text-gray-500">Dirección</span>
                        <p class="font-medium">
                            {sarlaft.representative.address}
                        </p>
                    </div>
                {/if}

                {#if sarlaft.representative.phone}
                    <div>
                        <span class="text-gray-500">Teléfono</span>
                        <p class="font-medium">
                            {sarlaft.representative.phone}
                        </p>
                    </div>
                {/if}

                {#if sarlaft.representative.email}
                    <div>
                        <span class="text-gray-500">Correo</span>
                        <p class="font-medium">
                            {sarlaft.representative.email}
                        </p>
                    </div>
                {/if}
            </div>
        </article>
    {/if}

    {#if sarlaft.relations?.length}
        <article class="bg-white rounded-xl border p-6 space-y-4">
            <h2 class="text-lg font-semibold text-gray-800">
                Relaciones / Vinculados
            </h2>

            <div class="space-y-3 text-sm">
                {#each sarlaft.relations as rel}
                    <div
                        class="grid grid-cols-1 md:grid-cols-2 gap-4 border rounded-lg p-4"
                    >
                        <div>
                            <span class="text-gray-500">Documento</span>
                            <p class="font-medium">
                                {rel.typeDoc}
                                {rel.docNumber}
                            </p>
                        </div>

                        <div>
                            <span class="text-gray-500"
                                >Razón Social / Nombre</span
                            >
                            <p class="font-medium">{rel.socialName}</p>
                        </div>

                        <div>
                            <span class="text-gray-500"
                                >Actividad / Recurso</span
                            >
                            <p class="font-medium">
                                {rel.activityAdminResource}
                            </p>
                        </div>

                        <div>
                            <span class="text-gray-500">% Participación</span>
                            <p class="font-medium">
                                {rel.percentageParticipation}%
                            </p>
                        </div>
                    </div>
                {/each}
            </div>
        </article>
    {/if}

    {#if sarlaft.accountEntityFinancials?.length}
        <article class="bg-white rounded-xl border p-6 space-y-4">
            <h2 class="text-lg font-semibold text-gray-800">
                Cuentas Financieras
            </h2>

            <div class="space-y-3 text-sm">
                {#each sarlaft.accountEntityFinancials as acc}
                    <div
                        class="grid grid-cols-1 md:grid-cols-3 gap-4 border rounded-lg p-4"
                    >
                        <div>
                            <span class="text-gray-500">Tipo</span>
                            <p class="font-medium">{acc.accountType}</p>
                        </div>

                        <div>
                            <span class="text-gray-500">Número</span>
                            <p class="font-medium">{acc.accountNumber}</p>
                        </div>

                        <div>
                            <span class="text-gray-500">Entidad</span>
                            <p class="font-medium">{acc.accountNameEntity}</p>
                        </div>
                    </div>
                {/each}
            </div>
        </article>
    {/if}

    {#if sarlaft.pep}
        <article class="bg-white rounded-xl border p-6 space-y-4">
            <h2 class="text-lg font-semibold text-gray-800">
                PEP (Persona Expuesta Políticamente)
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                    <span class="text-gray-500">¿Es PEP?</span>
                    <p class="font-medium">
                        {sarlaft.pep.relation ? "Sí" : "No"}
                    </p>
                </div>

                <div>
                    <span class="text-gray-500">Nombre relacionado</span>
                    <p class="font-medium">{sarlaft.pep.relationName}</p>
                </div>

                <div>
                    <span class="text-gray-500">Maneja recursos públicos</span>
                    <p class="font-medium">
                        {sarlaft.pep.managePublicResources ? "Sí" : "No"}
                    </p>
                </div>

                <div>
                    <span class="text-gray-500">Obligaciones tributarias</span>
                    <p class="font-medium">
                        {sarlaft.pep.taxObligations ? "Sí" : "No"}
                    </p>
                </div>
            </div>
        </article>
    {/if}

    {#if sarlaft.foreignCurrency?.products?.length}
        <article class="bg-white rounded-xl border p-6 space-y-4">
            <h2 class="text-lg font-semibold text-gray-800">
                Productos en Moneda Extranjera
            </h2>

            <div class="space-y-3 text-sm">
                {#each sarlaft.foreignCurrency.products as prod}
                    {#if prod.type}
                        <div
                            class="grid grid-cols-1 md:grid-cols-4 gap-4 border rounded-lg p-4"
                        >
                            <div>
                                <span class="text-gray-500">Tipo</span>
                                <p class="font-medium">{prod.type}</p>
                            </div>

                            <div>
                                <span class="text-gray-500">Entidad</span>
                                <p class="font-medium">{prod.entity}</p>
                            </div>

                            <div>
                                <span class="text-gray-500">País</span>
                                <p class="font-medium">{prod.country}</p>
                            </div>

                            <div>
                                <span class="text-gray-500">Moneda</span>
                                <p class="font-medium">{prod.currency}</p>
                            </div>
                        </div>
                    {/if}
                {/each}
            </div>
        </article>
    {/if}
    {#if sarlaft.signature}
        <article class="bg-white rounded-xl border p-6 space-y-4">
            <h2 class="text-lg font-semibold text-gray-800">
                Firma del Solicitante
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                    <span class="text-gray-500">Nombre</span>
                    <p class="font-medium">{sarlaft.signature.name}</p>
                </div>

                <div>
                    <span class="text-gray-500">Documento</span>
                    <p class="font-medium">{sarlaft.signature.document}</p>
                </div>
            </div>

            <img
                src={sarlaft.signature.signature}
                alt="Firma"
                class="mt-4 max-h-32 border rounded"
            />
        </article>
    {/if}

    {#if sarlaft.supportingDocuments}
        <article class="bg-white rounded-xl border p-6 space-y-4">
            <h2 class="text-lg font-semibold text-gray-800">
                Documentos Soporte
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {#if sarlaft.supportingDocuments.chamberOfCommerceCertificate}
                    <div>
                        <span class="text-gray-500"
                            >Certificado Cámara de Comercio</span
                        >
                        <p class="font-medium">
                            <a
                                href={sarlaft.supportingDocuments
                                    .chamberOfCommerceCertificate}
                                target="_blank"
                                class="text-primary-600 underline">Ver Documento</a
                            >
                        </p>
                    </div>
                {/if}

                {#if sarlaft.supportingDocuments.companyRut}
                    <div>
                        <span class="text-gray-500">RUT de la Empresa</span>
                        <p class="font-medium">
                            <a
                                href={sarlaft.supportingDocuments.companyRut}
                                target="_blank"
                                class="text-primary-600 underline">Ver Documento</a
                            >
                        </p>
                    </div>
                {/if}

                {#if sarlaft.supportingDocuments.legalRepresentativeId}
                    <div>
                        <span class="text-gray-500"
                            >Documento del Representante Legal</span
                        >
                        <p class="font-medium">
                            <a
                                href={sarlaft.supportingDocuments
                                    .legalRepresentativeId}
                                target="_blank"
                                class="text-primary-600 underline">Ver Documento</a
                            >
                        </p>
                    </div>
                {/if}

                {#if sarlaft.supportingDocuments.shareholdingCompositionCertificate}
                    <div>
                        <span class="text-gray-500"
                            >Certificado de Composición Accionaria</span
                        >
                        <p class="font-medium">
                            <a
                                href={sarlaft.supportingDocuments
                                    .shareholdingCompositionCertificate}
                                target="_blank"
                                class="text-primary-600 underline">Ver Documento</a
                            >
                        </p>
                    </div>
                {/if}
            </div>
        </article>
    {/if}
</section>
