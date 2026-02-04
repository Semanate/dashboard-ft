<script lang="ts">
    import { onMount } from "svelte";
    import { enhance } from "$app/forms";
    import {
        Alert,
        ButtonWithLoading,
        FormSection,
        Card,
    } from "$lib/components";
    import { goto } from "$app/navigation";

    let { form, data } = $props();
    let loading = $state(false);

    // If we have a session from the server (cookie), we are verified.
    // Otherwise, we start verifying (checking hash).
    let verifying = $state(!data.hasSession);
    let verificationError = $state("");

    onMount(async () => {
        if (data.hasSession) {
            verifying = false;
            return;
        }

        const hash = window.location.hash;
        if (hash && hash.includes("access_token")) {
            const params = new URLSearchParams(hash.substring(1));
            const accessToken = params.get("access_token");
            const refreshToken = params.get("refresh_token");

            if (accessToken && refreshToken) {
                try {
                    const res = await fetch("/api/auth/set-session", {
                        method: "POST",
                        body: JSON.stringify({
                            access_token: accessToken,
                            refresh_token: refreshToken,
                        }),
                        headers: { "Content-Type": "application/json" },
                    });

                    if (res.ok) {
                        // Reload to pick up the cookie in the server load function
                        window.location.reload();
                        return;
                    } else {
                        verificationError =
                            "No se pudo validar la sesión. Intenta solicitar un nuevo enlace.";
                    }
                } catch (e) {
                    verificationError = "Error de conexión.";
                }
            } else {
                verificationError = "Enlace incompleto.";
            }
        } else {
            verificationError = "Enlace inválido o expirado.";
        }
        verifying = false;
    });
</script>

<main class="min-h-screen flex items-center justify-center bg-primary/10 p-6">
    <Card
        content=""
        title=""
        class="w-full max-w-md overflow-hidden rounded-3xl shadow-xl bg-white"
    >
        <div class="p-8">
            <header class="mb-6 text-center">
                <h1 class="text-2xl font-bold text-gray-900">
                    Nueva contraseña
                </h1>
                <p class="text-gray-500 mt-2 text-sm">
                    Ingresa tu nueva contraseña a continuación.
                </p>
            </header>

            {#if verifying}
                <div class="text-center py-8">
                    <div
                        class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"
                    ></div>
                    <p class="text-gray-600">Verificando enlace...</p>
                </div>
            {:else if verificationError}
                <div class="text-center">
                    <Alert variant="danger" message={verificationError} />
                    <a
                        href="/forgot-password"
                        class="text-primary hover:underline mt-4 block text-sm font-semibold"
                        >Solicitar nuevo enlace</a
                    >
                </div>
            {:else}
                <form
                    method="POST"
                    use:enhance={() => {
                        loading = true;
                        return async ({ update }) => {
                            await update();
                            loading = false;
                        };
                    }}
                    class="space-y-6"
                >
                    <FormSection
                        fields={[
                            {
                                id: "password",
                                type: "password",
                                label: "Nueva Contraseña",
                                placeholder: "••••••••",
                                value: "",
                            },
                            {
                                id: "confirm_password",
                                type: "password",
                                label: "Confirmar Contraseña",
                                placeholder: "••••••••",
                                value: "",
                            },
                        ]}
                    />

                    {#if form?.error}
                        <Alert variant="danger" message={form.message} />
                    {/if}

                    <ButtonWithLoading
                        type="submit"
                        label="Cambiar contraseña"
                        variant="primary"
                        size="large"
                        class="w-full items-center justify-center"
                        {loading}
                    />
                </form>
            {/if}
        </div>
    </Card>
</main>
