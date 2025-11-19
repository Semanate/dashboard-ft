<script lang="ts">
  import Icon from "$lib/components/atoms/icon/Icon.svelte";
  import { fade } from "svelte/transition";
  interface UserInfoProps {
    name: string;
    email: string;
    transition?: any;
    role: "admin" | "user" | "guest";
  }
  const {
    name = "John Doe",
    email = "john.doe@example.com",
    role = "user",
  }: UserInfoProps = $props();

  const roleStyles = {
    admin: {
      icon: "ShieldCheck",
      color: "text-primary", // 🔴 admin
      bg: "bg-red-100",
    },
    user: {
      icon: "UserCheck",
      color: "text-green", // 🟢 user
      bg: "bg-green-100",
    },
    guest: {
      icon: "User",
      color: "text-gray-500", // ⚪ guest
      bg: "bg-gray-100",
    },
  };
  const current = roleStyles[role] ?? roleStyles["user"];
</script>

<div class="flex items-center gap-3 p-4">
  <div class="relative">
    <img
      src="https://i.pravatar.cc/40"
      alt="avatar"
      transition:fade={{ duration: 200 }}
      class="w-10 h-10 rounded-full"
    />
    <div
      class={`w-3 h-3 ${current.bg} absolute rounded-full right-0 top-[-1px] animate-pulse
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
