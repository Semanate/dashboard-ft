<script lang="ts">
  import ButtonWithLoading from "$lib/components/atoms/button/ButtonWithLoading.svelte";
  import IMAGE_URL from "$lib/assets/Login-cuate.svg";
  import FormSection from "$lib/components/molecules/form-section/FormSection.svelte";
  import Card from "$lib/components/molecules/card/Card.svelte";
</script>

<main class="min-h-screen grid place-items-center bg-primary/30 p-6">
  <Card
    title=""
    content=""
    class="w-full max-w-4xl! bg-white shadow-2xl rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-2"
  >
    <div class="p-10 flex flex-col justify-center">
      <h1 class="text-3xl font-bold mb-2">Hola!</h1>
      <p class="text-gray-500 mb-6">Hey, Bienvenido de vuelta</p>

      <form class="space-y-4 w-full">
        <FormSection
          title=""
          fields={[
            {
              type: "email",
              label: "Email",
              placeholder: "Enter your email address",
              value: "",
              onChange: () => {},
            },
            {
              type: "password",
              label: "Password",
              placeholder: "Enter your password",
              value: "",
              onChange: () => {},
            },
          ]}
        />

        <div class="flex justify-between items-center text-sm text-gray-500">
          <div class="flex items-center gap-2">
            <input type="checkbox" class="accent-primary" />
            <span>Remember me</span>
          </div>
          <a href="#" class="hover:underline">Forgot password?</a>
        </div>

        <ButtonWithLoading
          type="submit"
          label="Sign In"
          variant="primary"
          size="large"
          class="w-full"
        />
      </form>

      <p class="mt-6 text-sm">
        Don't have an account?
        <a href="#" class="text-primary font-semibold hover:underline"
          >Sign Up</a
        >
      </p>
    </div>

    <div
      class="bg-gradient-to-b from-white to-primary/20 flex items-center justify-center p-8"
    >
      <img
        src={IMAGE_URL}
        alt="Illustration"
        class="w-[80%] max-h-[480px] object-contain"
      />
    </div>
  </Card>
</main>
