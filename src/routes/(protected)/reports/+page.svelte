<script lang="ts">
    import { enhance } from "$app/forms";
    import {
        Alert,
        Badge,
        Button,
        Modal,
        PageHeader,
        StatCard
    } from "$lib/components";

    interface SarlaftForm {
        id: string;
        status: string;
        created_at: string;
        updated_at: string;
        type_person_agreement: string;
        payload: any;
        reviewed_at?: string;
        review_notes?: string;
    }

    interface Props {
        data: {
            pendingForms: SarlaftForm[];
            reviewedForms: SarlaftForm[];
            stats: {
                pending: number;
                approved: number;
                rejected: number;
            };
        };
        form?: {
            success?: boolean;
            message?: string;
            error?: string;
        };
    }

    const { data, form: actionResult }: Props = $props();

    let selectedForm: SarlaftForm | null = $state(null);

    let reviewNotes = $state("");
    let showApproveModal = $state(false);
    let showRejectModal = $state(false);
    let isSubmitting = $state(false);
    let activeTab = $state<"pending" | "history">("pending");

    function getFormName(form: SarlaftForm): string {
        if (form.type_person_agreement === "NAT") {
            const np = form?.payload?.naturalPerson;
            return np
                ? `${np.firstName || ""} ${np.lastName || ""}`.trim() ||
                      "Sin nombre"
                : "Sin nombre";
        } else {
            return form.payload?.juridicalPerson?.businessName || "Sin nombre";
        }
    }

    function getFormDocNumber(form: SarlaftForm): string {
        if (form.type_person_agreement === "NAT") {
            return form.payload?.naturalPerson?.docNumber || "N/A";
        } else {
            return form.payload?.juridicalPerson?.docNumber || "N/A";
        }
    }

    function getCreatorName(form: SarlaftForm): string {
        const p = form.payload.profiles;
        if (!p) return "Desconocido";
        return (
            `${p.first_name || ""} ${p.last_name || ""}`.trim() ||
            p.email ||
            "Desconocido"
        );
    }

    function openApproveModal(form: SarlaftForm) {
        selectedForm = form;
        reviewNotes = "";
        showApproveModal = true;
    }

    function openRejectModal(form: SarlaftForm) {
        selectedForm = form;
        reviewNotes = "";
        showRejectModal = true;
    }

    function closeModals() {
        showApproveModal = false;
        showRejectModal = false;
        selectedForm = null;
        reviewNotes = "";
    }

    function formatDate(date: string): string {
        return new Date(date).toLocaleDateString("es-CO", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    const statusLabels: Record<string, { label: string; variant: 'default' | 'warning' | 'success' | 'danger' }> = {
        draft: { label: "Borrador", variant: "default" },
        submitted: { label: "Pendiente", variant: "warning" },
        approved: { label: "Aprobado", variant: "success" },
        rejected: { label: "Rechazado", variant: "danger" },
    };
</script>

<section class="p-6 max-w-7xl mx-auto">
    <PageHeader
        title="📋 Revisión de Formularios SARLAFT"
        subtitle="Revise, apruebe o rechace los formularios SARLAFT enviados por los usuarios."
    />

    <!-- Mensaje de resultado -->
    {#if actionResult?.success}
        <div class="mb-6">
            <Alert type="success" message={actionResult.message ?? ''} />
        </div>
    {/if}

    {#if actionResult?.error}
        <div class="mb-6">
            <Alert type="error" message={actionResult.error} />
        </div>
    {/if}

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
            title="Pendientes"
            value={data.stats.pending}
            icon="⏳"
            variant="warning"
        />
        <StatCard
            title="Aprobados"
            value={data.stats.approved}
            icon="✅"
            variant="success"
        />
        <StatCard
            title="Rechazados"
            value={data.stats.rejected}
            icon="❌"
            variant="danger"
        />
    </div>

    <!-- Tabs -->
    <div class="border-b border-gray-200 mb-6">
        <nav class="flex gap-4">
            <button
                type="button"
                onclick={() => (activeTab = "pending")}
                class="pb-3 px-1 border-b-2 font-medium transition-colors
                       {activeTab === 'pending'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
            >
                📝 Pendientes de Revisión ({data.stats.pending})
            </button>
            <button
                type="button"
                onclick={() => (activeTab = "history")}
                class="pb-3 px-1 border-b-2 font-medium transition-colors
                       {activeTab === 'history'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
            >
                📚 Historial de Revisiones
            </button>
        </nav>
    </div>

    <!-- Pending Forms Tab -->
    {#if activeTab === "pending"}
        {#if data.pendingForms.length === 0}
            <div
                class="bg-white rounded-xl border border-gray-200 p-12 text-center"
            >
                <span class="text-6xl mb-4 block">🎉</span>
                <h3 class="text-xl font-semibold text-gray-900 mb-2">
                    ¡No hay formularios pendientes!
                </h3>
                <p class="text-gray-600">
                    Todos los formularios han sido revisados.
                </p>
            </div>
        {:else}
            <div class="space-y-4">
                {#each data.pendingForms as form}
                    <div
                        class="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div class="p-6">
                            <div
                                class="flex flex-wrap items-start justify-between gap-4"
                            >
                                <div class="flex-1 min-w-0">
                                    <div class="flex items-center gap-3 mb-2">
                                        <Badge
                                            label={statusLabels[form.status]?.label || form.status}
                                            variant={statusLabels[form.status]?.variant || 'default'}
                                        />
                                        <span class="text-sm text-gray-500">
                                            {form.type_person_agreement === "NAT"
                                                ? "👤 Persona Natural"
                                                : "🏢 Persona Jurídica"}
                                        </span>
                                    </div>

                                    <h3 class="text-lg font-semibold text-gray-900 mb-1">
                                        {getFormName(form)}
                                    </h3>

                                    <div class="flex flex-wrap gap-4 text-sm text-gray-600">
                                        <span>📄 Doc: {getFormDocNumber(form)}</span>
                                        <span>👤 Creado por: {getCreatorName(form)}</span>
                                        <span>📅 Enviado: {formatDate(form.updated_at)}</span>
                                    </div>
                                </div>

                                <div class="flex gap-2">
                                    <a
                                        href="/sarlaft/{form.id}"
                                        class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                                    >
                                        👁️ Ver Detalle
                                    </a>
                                    <Button
                                        label="✅ Aprobar"
                                        variant="primary"
                                        onclick={() => openApproveModal(form)}
                                    />
                                    <button
                                        type="button"
                                        onclick={() => openRejectModal(form)}
                                        class="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                                    >
                                        ❌ Rechazar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        {/if}
    {/if}

    <!-- History Tab -->
    {#if activeTab === "history"}
        {#if data.reviewedForms.length === 0}
            <div
                class="bg-white rounded-xl border border-gray-200 p-12 text-center"
            >
                <span class="text-6xl mb-4 block">📭</span>
                <h3 class="text-xl font-semibold text-gray-900 mb-2">
                    Sin historial
                </h3>
                <p class="text-gray-600">Aún no se han revisado formularios.</p>
            </div>
        {:else}
            <div
                class="bg-white rounded-xl border border-gray-200 overflow-hidden"
            >
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Formulario
                            </th>
                            <th
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Tipo
                            </th>
                            <th
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Estado
                            </th>
                            <th
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Fecha Revisión
                            </th>
                            <th
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Notas
                            </th>
                            <th
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        {#each data.reviewedForms as form}
                            <tr class="hover:bg-gray-50">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="font-medium text-gray-900">
                                        {getFormName(form)}
                                    </div>
                                    <div class="text-sm text-gray-500">
                                        {getFormDocNumber(form)}
                                    </div>
                                </td>
                                <td
                                    class="px-6 py-4 whitespace-nowrap text-sm text-gray-600"
                                >
                                    {form.type_person_agreement === "NAT"
                                        ? "👤 Natural"
                                        : "🏢 Jurídica"}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <Badge
                                        label={statusLabels[form.status]?.label || form.status}
                                        variant={statusLabels[form.status]?.variant || 'default'}
                                    />
                                </td>
                                <td
                                    class="px-6 py-4 whitespace-nowrap text-sm text-gray-600"
                                >
                                    {form.reviewed_at
                                        ? formatDate(form.reviewed_at)
                                        : "N/A"}
                                </td>
                                <td
                                    class="px-6 py-4 text-sm text-gray-600 max-w-xs truncate"
                                >
                                    {form.review_notes || "-"}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <a
                                        href="/sarlaft/{form.id}"
                                        class="text-indigo-600 hover:text-indigo-900 font-medium"
                                    >
                                        Ver
                                    </a>
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        {/if}
    {/if}
</section>

<!-- Modal Aprobar -->
<Modal 
    isOpen={showApproveModal && !!selectedForm} 
    title="✅ Aprobar Formulario" 
    onClose={closeModals}
>
    {#if selectedForm}
        <p class="text-gray-600 mb-4">
            ¿Está seguro de aprobar el formulario de <strong>{getFormName(selectedForm)}</strong>?
        </p>

        <form
            method="POST"
            action="?/approve"
            use:enhance={() => {
                isSubmitting = true;
                return async ({ update }) => {
                    await update();
                    isSubmitting = false;
                    closeModals();
                };
            }}
        >
            <input type="hidden" name="formId" value={selectedForm.id} />

            <div class="mb-4">
                <label
                    for="approve-notes"
                    class="block text-sm font-medium text-gray-700 mb-1"
                >
                    Notas (opcional)
                </label>
                <textarea
                    id="approve-notes"
                    name="notes"
                    bind:value={reviewNotes}
                    rows="3"
                    placeholder="Agregue observaciones o comentarios..."
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                ></textarea>
            </div>

            <div class="flex gap-3">
                <Button
                    label="Cancelar"
                    variant="secondary"
                    onclick={closeModals}
                    class="flex-1"
                />
                <Button
                    type="submit"
                    label={isSubmitting ? "Aprobando..." : "✅ Confirmar Aprobación"}
                    variant="primary"
                    disabled={isSubmitting}
                    class="flex-1"
                />
            </div>
        </form>
    {/if}
</Modal>

<!-- Modal Rechazar -->
<Modal 
    isOpen={showRejectModal && !!selectedForm} 
    title="❌ Rechazar Formulario" 
    onClose={closeModals}
>
    {#if selectedForm}
        <p class="text-gray-600 mb-4">
            ¿Está seguro de rechazar el formulario de <strong>{getFormName(selectedForm)}</strong>?
        </p>

        <form
            method="POST"
            action="?/reject"
            use:enhance={() => {
                isSubmitting = true;
                return async ({ update }) => {
                    await update();
                    isSubmitting = false;
                    closeModals();
                };
            }}
        >
            <input type="hidden" name="formId" value={selectedForm.id} />

            <div class="mb-4">
                <label
                    for="reject-notes"
                    class="block text-sm font-medium text-gray-700 mb-1"
                >
                    Razón del rechazo *
                </label>
                <textarea
                    id="reject-notes"
                    name="notes"
                    bind:value={reviewNotes}
                    rows="3"
                    required
                    minlength="10"
                    placeholder="Explique la razón del rechazo (mínimo 10 caracteres)..."
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                ></textarea>
                <p class="text-xs text-gray-500 mt-1">
                    Mínimo 10 caracteres
                </p>
            </div>

            <div class="flex gap-3">
                <Button
                    label="Cancelar"
                    variant="secondary"
                    onclick={closeModals}
                    class="flex-1"
                />
                <Button
                    type="submit"
                    label={isSubmitting ? "Rechazando..." : "❌ Confirmar Rechazo"}
                    variant="danger"
                    disabled={isSubmitting || reviewNotes.length < 10}
                    class="flex-1"
                />
            </div>
        </form>
    {/if}
</Modal>
