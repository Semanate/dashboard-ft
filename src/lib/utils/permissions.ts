/**
 * Utilidades para manejo de permisos en el frontend
 * 
 * Soporta tanto permisos estáticos (ROLE_PERMISSIONS) como dinámicos (de la DB)
 */

import { 
    hasPermission, 
    hasAnyPermission, 
    hasAllPermissions, 
    canAccessRoute,
    getRoleLabel,
    ROLES,
    PERMISSIONS,
    type Role,
    type Permission 
} from '$lib/types/roles';

/**
 * Tipo para permisos cargados desde la base de datos
 */
export interface DbPermission {
    id: string;
    code: string;
    name: string;
    description?: string;
    module: string;
}

/**
 * Crea un objeto de permisos usando la configuración estática (ROLE_PERMISSIONS)
 * @deprecated Usar createDynamicPermissionChecker para permisos dinámicos de la DB
 */
export function createPermissionChecker(role: Role) {
    return {
        role,
        roleLabel: getRoleLabel(role),
        
        // Verificaciones de rol
        isAdmin: role === ROLES.ADMIN,
        isUser: role === ROLES.USER,
        isComplianceOfficer: role === ROLES.COMPLIANCE_OFFICER,
        
        // Métodos de permisos (usa matriz estática)
        can: (permission: Permission) => hasPermission(role, permission),
        canAll: (permissions: Permission[]) => hasAllPermissions(role, permissions),
        canAny: (permissions: Permission[]) => hasAnyPermission(role, permissions),
        canAccess: (route: string) => canAccessRoute(role, route),
        
        // Permisos específicos comunes (estáticos)
        canViewDashboard: hasPermission(role, PERMISSIONS.VIEW_DASHBOARD),
        canManageUsers: hasPermission(role, PERMISSIONS.MANAGE_USERS),
        canUpdateRoles: hasPermission(role, PERMISSIONS.UPDATE_USER_ROLES),
        canViewSarlaft: hasPermission(role, PERMISSIONS.VIEW_SARLAFT),
        canCreateSarlaft: hasPermission(role, PERMISSIONS.CREATE_SARLAFT),
        canApproveSarlaft: hasPermission(role, PERMISSIONS.APPROVE_SARLAFT),
        canViewAllSarlaft: hasPermission(role, PERMISSIONS.VIEW_ALL_SARLAFT),
        canManageNews: hasPermission(role, PERMISSIONS.MANAGE_NEWS),
        canViewReports: hasPermission(role, PERMISSIONS.VIEW_REPORTS),
        canExportReports: hasPermission(role, PERMISSIONS.EXPORT_REPORTS),
        canManageSettings: hasPermission(role, PERMISSIONS.MANAGE_SETTINGS)
    };
}

/**
 * Crea un objeto de permisos dinámico usando los permisos de la base de datos
 * 
 * @param role - El rol del usuario
 * @param userPermissions - Array de códigos de permisos asignados al rol desde la DB
 */
export function createDynamicPermissionChecker(role: Role, userPermissions: string[]) {
    const permissionSet = new Set(userPermissions);
    
    return {
        role,
        roleLabel: getRoleLabel(role),
        permissions: userPermissions,
        
        // Verificaciones de rol
        isAdmin: role === ROLES.ADMIN,
        isUser: role === ROLES.USER,
        isComplianceOfficer: role === ROLES.COMPLIANCE_OFFICER,
        
        // Métodos de permisos (usa permisos de la DB)
        can: (permissionCode: string) => permissionSet.has(permissionCode),
        canAll: (permissionCodes: string[]) => permissionCodes.every(p => permissionSet.has(p)),
        canAny: (permissionCodes: string[]) => permissionCodes.some(p => permissionSet.has(p)),
        
        // Para compatibilidad con rutas, aún usa el sistema estático
        canAccess: (route: string) => canAccessRoute(role, route),
        
        // Helpers para permisos comunes (dinámicos)
        canViewDashboard: permissionSet.has('view_dashboard'),
        canManageUsers: permissionSet.has('manage_users'),
        canUpdateRoles: permissionSet.has('update_user_roles'),
        canViewSarlaft: permissionSet.has('view_sarlaft'),
        canCreateSarlaft: permissionSet.has('create_sarlaft'),
        canApproveSarlaft: permissionSet.has('approve_sarlaft'),
        canViewAllSarlaft: permissionSet.has('view_all_sarlaft'),
        canManageNews: permissionSet.has('manage_news'),
        canViewReports: permissionSet.has('view_reports'),
        canExportReports: permissionSet.has('export_reports'),
        canManageSettings: permissionSet.has('manage_settings')
    };
}

export type PermissionChecker = ReturnType<typeof createPermissionChecker>;
export type DynamicPermissionChecker = ReturnType<typeof createDynamicPermissionChecker>;

/**
 * Items del menú con sus permisos requeridos
 */
const MENU_ITEMS = [
    {
        label: 'Dashboard',
        icon: 'LayoutDashboard',
        href: '/dashboard',
        permission: 'view_dashboard'
    },
    {
        label: 'SARLAFT',
        icon: 'FileText',
        href: '/sarlaft',
        permission: 'view_sarlaft'
    },
    {
        label: 'Reportes',
        icon: 'BarChart3',
        href: '/reports',
        permission: 'view_reports'
    },
    {
        label: 'Usuarios',
        icon: 'Users',
        href: '/admin/users',
        permission: 'manage_users'
    },
    {
        label: 'Noticias',
        icon: 'Newspaper',
        href: '/admin/news',
        permission: 'manage_news'
    },
    {
        label: 'Configuración',
        icon: 'Settings',
        href: '/admin/settings',
        permission: 'manage_settings'
    },
    {
        label: 'Mi Perfil',
        icon: 'User',
        href: '/profile',
        permission: 'view_profile'
    }
];

/**
 * Genera los items del menú según el rol del usuario (usa permisos estáticos)
 * @deprecated Usar getDynamicMenuItems para permisos de la DB
 */
export function getMenuItemsByRole(role: Role, currentPath: string) {
    const checker = createPermissionChecker(role);
    
    return MENU_ITEMS
        .filter(item => checker.can(item.permission as Permission))
        .map(item => ({
            ...item,
            active: currentPath.startsWith(item.href),
            disabled: false
        }));
}

/**
 * Genera los items del menú usando permisos dinámicos de la base de datos
 * 
 * @param role - El rol del usuario
 * @param userPermissions - Array de códigos de permisos asignados desde la DB
 * @param currentPath - La ruta actual para marcar el item activo
 */
export function getDynamicMenuItems(role: Role, userPermissions: string[], currentPath: string) {
    const checker = createDynamicPermissionChecker(role, userPermissions);
    
    return MENU_ITEMS
        .filter(item => checker.can(item.permission))
        .map(item => ({
            ...item,
            active: currentPath.startsWith(item.href),
            disabled: false
        }));
}

/**
 * HOC para verificar permisos antes de mostrar un componente
 */
export function withPermission(role: Role, requiredPermission: Permission): boolean {
    return hasPermission(role, requiredPermission);
}

/**
 * Guard para acciones que requieren permisos
 */
export function requirePermission(role: Role, permission: Permission, action: () => void) {
    if (hasPermission(role, permission)) {
        action();
    } else {
        console.warn(`Permission denied: ${permission} for role ${role}`);
    }
}
