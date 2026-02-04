<script lang="ts">
    import { enhance } from "$app/forms";
    import {
        Alert,
        ButtonWithLoading,
        FormSection,
        Card,
    } from "$lib/components";

    let { form } = $props();
    let loading = $state(false);
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
                    Recuperar contraseña
                </h1>
                <p class="text-gray-500 mt-2 text-sm">
                    Ingresa tu correo para recibir un enlace de recuperación.
                </p>
            </header>

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
                            id: "email",
                            type: "email",
                            label: "Correo electrónico",
                            placeholder: "correo@ejemplo.com",
                            value: "",
                        },
                    ]}
                />

                {#if form?.success}
                    <Alert variant="success" message={form.message} />
                {:else if form?.error}
                    <Alert variant="danger" message={form.message} />
                {/if}

                <ButtonWithLoading
                    type="submit"
                    label="Enviar enlace"
                    variant="primary"
                    size="large"
                    class="w-full items-center justify-center"
                    {loading}
                />

                <div class="text-center mt-4 text-sm text-gray-600">
                    <a
                        href="/login"
                        class="font-semibold text-primary hover:underline"
                        >Volver al inicio de sesión</a
                    >
                </div>
            </form>
        </div>
    </Card>
</main>
