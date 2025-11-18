<script lang="ts">
</script>

<div class="max-w-md mx-auto mt-10">
  <h1 class="text-2xl font-bold mb-6">Register</h1>
  <form class="space-y-4">
    <div>
      <label for="username" class="block text-sm font-medium text-gray-700"
        >Username</label
      >
      <input
        type="text"
        id="username"
        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        placeholder="Enter your username"
      />
    </div>
    <div>
      <label for="email" class="block text-sm font-medium text-gray-700"
        >Email</label
      >
      <input
        type="email"
        id="email"
        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        placeholder="Enter your email"
      />
    </div>
    <div>
      <label for="password" class="block text-sm font-medium text-gray-700"
        >Password</label
      >
      <input
        type="password"
        id="password"
        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        placeholder="Enter your password"
      />
    </div>
    <button
      type="submit"
      class="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700"
    >
      Register
    </button>
  </form>
</div>
