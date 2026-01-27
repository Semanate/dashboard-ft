<script lang="ts">
  import Icon from "$lib/components/atoms/icon/Icon.svelte";
  import { fade } from "svelte/transition";
  interface UserInfoProps {
    name: string;
    email: string;
    avatarUrl?: string;
    transition?: any;
    role: string;
  }
  const {
    name = "John Doe",
    email = "john.doe@example.com",
    avatarUrl,
    role = "user",
  }: UserInfoProps = $props();

  // Generar URL de avatar por defecto si no hay uno
  let displayAvatarUrl = $derived(
    avatarUrl || 
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff&size=80`
  );

  const roleStyles: Record<string, { icon: string; color: string; bg: string }> = {
    admin: {
      icon: "ShieldCheck",
      color: "text-primary",
      bg: "bg-red-100",
    },
    Administrador: {
      icon: "ShieldCheck",
      color: "text-primary",
      bg: "bg-red-100",
    },
    user: {
      icon: "UserCheck",
      color: "text-green",
      bg: "bg-green-100",
    },
    Usuario: {
      icon: "UserCheck",
      color: "text-green",
      bg: "bg-green-100",
    },
    "Oficial de Cumplimiento": {
      icon: "Shield",
      color: "text-blue-500",
      bg: "bg-blue-100",
    },
    compliance_officer: {
      icon: "Shield",
      color: "text-blue-500",
      bg: "bg-blue-100",
    },
    guest: {
      icon: "User",
      color: "text-gray-500",
      bg: "bg-gray-100",
    },
  };
  const current = $derived(roleStyles[role] ?? roleStyles["user"]);
</script>

<div class="flex items-center gap-3 p-4">
  <div class="relative">
    <img
      src={displayAvatarUrl}
      alt="avatar"
      transition:fade={{ duration: 200 }}
      class="w-10 h-10 rounded-full object-cover"
    />
    <div
      class={`w-3 h-3 ${current.bg} absolute rounded-full right-0 -top-px animate-pulse
            flex items-center justify-center shadow`}
    ></div>
  </div>

  <div class="flex flex-col">
    <span class="font-semibold" transition:fade={{ duration: 200 }}>{name}</span
    >
    <span class="text-sm text-gray-500" transition:fade={{ duration: 200 }}
      >{email}</span
    >
  </div>
</div>
