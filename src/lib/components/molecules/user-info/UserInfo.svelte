<script lang="ts">
  import { fade } from "svelte/transition";
  interface UserInfoProps {
    name: string;
    email: string;
    transition?: any;
  }
  const { name = "John Doe", email = "john.doe@example.com" }: UserInfoProps =
    $props();
</script>

<div class="flex items-center gap-3 p-4">
  <img
    src="https://i.pravatar.cc/40"
    alt="avatar"
    transition:fade={{ duration: 200 }}
    class="w-10 h-10 rounded-full"
  />

  <div class="flex flex-col">
    <span class="font-semibold" transition:fade={{ duration: 200 }}>{name}</span>
    <span class="text-sm text-gray-500" transition:fade={{ duration: 200 }}>{email}</span>
  </div>
</div>
