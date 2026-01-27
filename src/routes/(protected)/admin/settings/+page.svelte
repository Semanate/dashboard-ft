<script lang="ts">
    const settingsCards = [
        {
            title: 'Gestión de Permisos',
            description: 'Configura los permisos de cada rol del sistema',
            icon: '🔐',
            href: '/admin/settings/permissions',
            color: 'indigo'
        },
        {
            title: 'Usuarios',
            description: 'Administra los usuarios y sus roles',
            icon: '👥',
            href: '/admin/users',
            color: 'blue'
        },
        {
            title: 'Noticias',
            description: 'Gestiona las noticias y comunicados',
            icon: '📰',
            href: '/admin/news',
            color: 'green'
        }
    ];
</script>

<section class="container mx-auto px-4 py-8">
    <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Configuración</h1>
        <p class="mt-2 text-gray-600">Administra la configuración del sistema</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each settingsCards as card}
            <a 
                href={card.href}
                class="block p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-{card.color}-300 transition-all group"
            >
                <div class="text-4xl mb-4">{card.icon}</div>
                <h2 class="text-xl font-semibold text-gray-900 group-hover:text-{card.color}-600 transition-colors">
                    {card.title}
                </h2>
                <p class="mt-2 text-gray-600">{card.description}</p>
                <div class="mt-4 text-{card.color}-600 font-medium flex items-center gap-2">
                    Configurar
                    <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                    </svg>
                </div>
            </a>
        {/each}
    </div>
</section>
