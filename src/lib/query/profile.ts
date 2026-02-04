
type UpdateProfileParams = {
    display_name: string;
    phone: string;
};

export const profileKeys = {
    all: ['profile'] as const,
};

export const updates = {
    uploadAvatar: {
        options: {
            mutationFn: async (file: File) => {
                const formData = new FormData();
                formData.append('avatar', file);
                const res = await fetch('/api/profile/avatar', {
                    method: 'POST',
                    body: formData
                });
                const result = await res.json();
                if (!result.success) throw new Error(result.error || 'Error al subir la foto.');
                return result.data;
            }
        }
    },
    removeAvatar: {
        options: {
            mutationFn: async () => {
                const res = await fetch('/api/profile/avatar', {
                    method: 'DELETE'
                });
                const result = await res.json();
                if (!result.success) throw new Error(result.error || 'Error al eliminar la foto.');
                return result;
            }
        }
    },
    updateProfile: {
        options: {
            mutationFn: async (data: UpdateProfileParams) => {
                const res = await fetch('/api/profile', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                const result = await res.json();
                if (!result.success) throw new Error(result.error || 'Error al guardar.');
                return result;
            }
        }
    }
};
