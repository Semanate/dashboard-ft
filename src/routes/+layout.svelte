<script lang="ts">
  import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";
  import { browser } from "$app/environment";
  import { onMount } from "svelte";
  import "$lib/styles/app.css";
  import favicon from "$lib/assets/favicon.svg";
  import { themeState } from "$lib/stores/theme.svelte";

  let { children } = $props();

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        enabled: browser,
      },
    },
  });

  onMount(async () => {
    themeState.init();

    // Handle Supabase Auth Hash (Magic Links, Recovery, etc)
    const hash = window.location.hash;
    if (hash && hash.includes("access_token")) {
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");
      const type = params.get("type");

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
            // Remove hash from URL to keep it clean
            window.history.replaceState(null, "", window.location.pathname);

            // Redirect based on type
            if (type === "recovery") {
              window.location.href = "/update-password";
            } else {
              window.location.href = "/dashboard";
            }
          }
        } catch (error) {
          console.error("Error setting session from hash:", error);
        }
      }
    }
  });
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<QueryClientProvider client={queryClient}>
  {@render children()}
</QueryClientProvider>
