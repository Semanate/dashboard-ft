<script lang="ts">
  interface UserInfoProps {
    name: string;
    email: string;
  }
  const { name = "John Doe", email = "john.doe@example.com" }: UserInfoProps =
    $props();
</script>

<div class="flex items-center gap-3 p-4">
  <img
    src="https://i.pravatar.cc/40"
    alt="avatar"
    class="w-10 h-10 rounded-full"
  />

  <div class="flex flex-col">
    <span class="font-semibold">{name}</span>
    <span class="text-sm text-gray-500">{email}</span>
  </div>
</div>
