import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) {
        throw redirect(303, '/login');
    }

    const { supabase } = locals;

    // Obtener todos los permisos
    const { data: permissions, error: permError } = await supabase
        .from('permissions')
        .select('*')
        .order('module', { ascending: true })
        .order('code', { ascending: true });

    if (permError) {
        console.error('Error loading permissions:', permError);
        return { permissions: [], rolePermissions: [], error: permError.message };
    }

    // Obtener todas las asignaciones de permisos por rol
    const { data: rolePermissions, error: rpError } = await supabase
        .from('role_permissions')
        .select(`
            id,
            role,
            permission_id,
            permissions (
                id,
                code,
                name,
                module
            )
        `);

    if (rpError) {
        console.error('Error loading role permissions:', rpError);
        return { permissions, rolePermissions: [], error: rpError.message };
    }

    // Agrupar permisos por módulo para la UI
    const permissionsByModule = permissions?.reduce((acc: Record<string, typeof permissions>, perm) => {
        const module = perm.module || 'other';
        if (!acc[module]) {
            acc[module] = [];
        }
        acc[module].push(perm);
        return acc;
    }, {}) || {};

    // Obtener lista única de módulos
    const modules = [...new Set(permissions?.map(p => p.module) || [])].sort();

    // Crear un mapa de rol -> permisos asignados
    const rolePermissionsMap: Record<string, string[]> = {
        admin: [],
        user: [],
        compliance_officer: []
    };

    rolePermissions?.forEach((rp) => {
        const rpData = rp as { role: string; permission_id: string };
        if (rpData.role && rpData.permission_id) {
            if (!rolePermissionsMap[rpData.role]) {
                rolePermissionsMap[rpData.role] = [];
            }
            rolePermissionsMap[rpData.role].push(rpData.permission_id);
        }
    });

    return {
        permissions,
        permissionsByModule,
        rolePermissionsMap,
        modules
    };
};

export const actions: Actions = {
    updateRolePermissions: async ({ request, locals }) => {
        if (!locals.user || locals.user.role !== 'admin') {
            return { error: 'No tienes permisos para realizar esta acción' };
        }

        const { supabase } = locals;
        const formData = await request.formData();
        
        const role = formData.get('role')?.toString();
        const permissionsJson = formData.get('permissions')?.toString();

        if (!role || !permissionsJson) {
            return { error: 'Rol y permisos son requeridos' };
        }

        const permissionIds: string[] = JSON.parse(permissionsJson);

        try {
            // Eliminar todos los permisos actuales del rol
            const { error: deleteError } = await supabase
                .from('role_permissions')
                .delete()
                .eq('role', role);

            if (deleteError) {
                console.error('Error deleting permissions:', deleteError);
                return { error: 'Error al eliminar permisos existentes' };
            }

            // Insertar los nuevos permisos
            if (permissionIds.length > 0) {
                const newPermissions = permissionIds.map(permissionId => ({
                    role,
                    permission_id: permissionId
                }));

                const { error: insertError } = await supabase
                    .from('role_permissions')
                    .insert(newPermissions);

                if (insertError) {
                    console.error('Error inserting permissions:', insertError);
                    return { error: 'Error al asignar nuevos permisos' };
                }
            }

            return { success: true, message: `Permisos actualizados para el rol ${role}` };
        } catch (err) {
            console.error('Error updating permissions:', err);
            return { error: 'Error interno del servidor' };
        }
    },

    createPermission: async ({ request, locals }) => {
        if (!locals.user || locals.user.role !== 'admin') {
            return { error: 'No tienes permisos para realizar esta acción' };
        }

        const { supabase } = locals;
        const formData = await request.formData();
        
        const code = formData.get('code')?.toString()?.trim();
        const name = formData.get('name')?.toString()?.trim();
        const description = formData.get('description')?.toString()?.trim();
        const module = formData.get('module')?.toString()?.trim();

        if (!code || !name || !module) {
            return { error: 'Código, nombre y módulo son requeridos' };
        }

        // Validar formato del código (snake_case)
        if (!/^[a-z][a-z0-9_]*$/.test(code)) {
            return { error: 'El código debe estar en formato snake_case (ej: view_users)' };
        }

        try {
            const { data, error } = await supabase
                .from('permissions')
                .insert({
                    code,
                    name,
                    description: description || null,
                    module
                })
                .select()
                .single();

            if (error) {
                if (error.code === '23505') {
                    return { error: 'Ya existe un permiso con ese código' };
                }
                console.error('Error creating permission:', error);
                return { error: 'Error al crear el permiso' };
            }

            return { success: true, message: `Permiso "${name}" creado exitosamente`, created: data };
        } catch (err) {
            console.error('Error creating permission:', err);
            return { error: 'Error interno del servidor' };
        }
    },

    updatePermission: async ({ request, locals }) => {
        if (!locals.user || locals.user.role !== 'admin') {
            return { error: 'No tienes permisos para realizar esta acción' };
        }

        const { supabase } = locals;
        const formData = await request.formData();
        
        const id = formData.get('id')?.toString();
        const code = formData.get('code')?.toString()?.trim();
        const name = formData.get('name')?.toString()?.trim();
        const description = formData.get('description')?.toString()?.trim();
        const module = formData.get('module')?.toString()?.trim();

        if (!id || !code || !name || !module) {
            return { error: 'ID, código, nombre y módulo son requeridos' };
        }

        try {
            const { error } = await supabase
                .from('permissions')
                .update({
                    code,
                    name,
                    description: description || null,
                    module
                })
                .eq('id', id);

            if (error) {
                if (error.code === '23505') {
                    return { error: 'Ya existe un permiso con ese código' };
                }
                console.error('Error updating permission:', error);
                return { error: 'Error al actualizar el permiso' };
            }

            return { success: true, message: `Permiso "${name}" actualizado exitosamente` };
        } catch (err) {
            console.error('Error updating permission:', err);
            return { error: 'Error interno del servidor' };
        }
    },

    deletePermission: async ({ request, locals }) => {
        if (!locals.user || locals.user.role !== 'admin') {
            return { error: 'No tienes permisos para realizar esta acción' };
        }

        const { supabase } = locals;
        const formData = await request.formData();
        
        const id = formData.get('id')?.toString();
        const name = formData.get('name')?.toString();

        if (!id) {
            return { error: 'ID del permiso es requerido' };
        }

        try {
            // Primero eliminar las relaciones con roles
            await supabase
                .from('role_permissions')
                .delete()
                .eq('permission_id', id);

            // Luego eliminar el permiso
            const { error } = await supabase
                .from('permissions')
                .delete()
                .eq('id', id);

            if (error) {
                console.error('Error deleting permission:', error);
                return { error: 'Error al eliminar el permiso' };
            }

            return { success: true, message: `Permiso "${name}" eliminado exitosamente` };
        } catch (err) {
            console.error('Error deleting permission:', err);
            return { error: 'Error interno del servidor' };
        }
    }
};
