/**
 * Sistema de Roles y Permisos
 * 
 * Roles disponibles:
 * - admin: Acceso completo a todas las funcionalidades
 * - user: Usuario normal con acceso básico
 * - compliance_officer: Oficial de cumplimiento con acceso a SARLAFT y reportes
 */

export const ROLES = {
    ADMIN: 'admin',
    USER: 'user',
    COMPLIANCE_OFFICER: 'compliance_officer'
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

export const ROLE_LABELS: Record<Role, string> = {
    [ROLES.ADMIN]: 'Administrador',
    [ROLES.USER]: 'Usuario',
    [ROLES.COMPLIANCE_OFFICER]: 'Oficial de Cumplimiento'
};

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
    [ROLES.ADMIN]: 'Acceso completo a todas las funcionalidades del sistema',
    [ROLES.USER]: 'Acceso básico para visualizar y gestionar su información personal',
    [ROLES.COMPLIANCE_OFFICER]: 'Acceso a módulos SARLAFT, reportes de cumplimiento y gestión de riesgos'
};

/**
 * Permisos disponibles en el sistema
 */
export const PERMISSIONS = {
    // Dashboard
    VIEW_DASHBOARD: 'view_dashboard',
    
    // Usuarios
    VIEW_USERS: 'view_users',
    MANAGE_USERS: 'manage_users',
    UPDATE_USER_ROLES: 'update_user_roles',
    
    // SARLAFT
    VIEW_SARLAFT: 'view_sarlaft',
    CREATE_SARLAFT: 'create_sarlaft',
    EDIT_SARLAFT: 'edit_sarlaft',
    DELETE_SARLAFT: 'delete_sarlaft',
    APPROVE_SARLAFT: 'approve_sarlaft',
    VIEW_ALL_SARLAFT: 'view_all_sarlaft',
    
    // Noticias
    VIEW_NEWS: 'view_news',
    MANAGE_NEWS: 'manage_news',
    
    // Reportes
    VIEW_REPORTS: 'view_reports',
    EXPORT_REPORTS: 'export_reports',
    
    // Configuración
    VIEW_SETTINGS: 'view_settings',
    MANAGE_SETTINGS: 'manage_settings',
    
    // Perfil
    VIEW_PROFILE: 'view_profile',
    EDIT_PROFILE: 'edit_profile'
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

/**
 * Matriz de permisos por rol
 */
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
    [ROLES.ADMIN]: Object.values(PERMISSIONS), // Admin tiene todos los permisos
    
    [ROLES.USER]: [
        PERMISSIONS.VIEW_DASHBOARD,
        PERMISSIONS.VIEW_SARLAFT,
        PERMISSIONS.CREATE_SARLAFT,
        PERMISSIONS.EDIT_SARLAFT,
        PERMISSIONS.VIEW_NEWS,
        PERMISSIONS.VIEW_PROFILE,
        PERMISSIONS.EDIT_PROFILE
    ],
    
    [ROLES.COMPLIANCE_OFFICER]: [
        PERMISSIONS.VIEW_DASHBOARD,
        PERMISSIONS.VIEW_USERS,
        PERMISSIONS.VIEW_SARLAFT,
        PERMISSIONS.CREATE_SARLAFT,
        PERMISSIONS.EDIT_SARLAFT,
        PERMISSIONS.DELETE_SARLAFT,
        PERMISSIONS.APPROVE_SARLAFT,
        PERMISSIONS.VIEW_ALL_SARLAFT,
        PERMISSIONS.VIEW_NEWS,
        PERMISSIONS.VIEW_REPORTS,
        PERMISSIONS.EXPORT_REPORTS,
        PERMISSIONS.VIEW_PROFILE,
        PERMISSIONS.EDIT_PROFILE
    ]
};

/**
 * Rutas protegidas por rol
 */
export const PROTECTED_ROUTES: Record<string, Role[]> = {
    '/admin': [ROLES.ADMIN],
    '/admin/users': [ROLES.ADMIN],
    '/admin/settings': [ROLES.ADMIN],
    '/admin/news': [ROLES.ADMIN],
    '/dashboard': [ROLES.ADMIN, ROLES.USER, ROLES.COMPLIANCE_OFFICER],
    '/sarlaft': [ROLES.ADMIN, ROLES.USER, ROLES.COMPLIANCE_OFFICER],
    '/sarlaft/create': [ROLES.ADMIN, ROLES.USER, ROLES.COMPLIANCE_OFFICER],
    '/profile': [ROLES.ADMIN, ROLES.USER, ROLES.COMPLIANCE_OFFICER],
    '/reports': [ROLES.ADMIN, ROLES.COMPLIANCE_OFFICER]
};

/**
 * Verifica si un rol tiene un permiso específico
 */
export function hasPermission(role: Role, permission: Permission): boolean {
    const permissions = ROLE_PERMISSIONS[role];
    return permissions?.includes(permission) ?? false;
}

/**
 * Verifica si un rol tiene todos los permisos especificados
 */
export function hasAllPermissions(role: Role, permissions: Permission[]): boolean {
    return permissions.every(permission => hasPermission(role, permission));
}

/**
 * Verifica si un rol tiene al menos uno de los permisos especificados
 */
export function hasAnyPermission(role: Role, permissions: Permission[]): boolean {
    return permissions.some(permission => hasPermission(role, permission));
}

/**
 * Verifica si un rol tiene acceso a una ruta específica
 */
export function canAccessRoute(role: Role, route: string): boolean {
    // Buscar la ruta más específica que coincida
    const matchingRoutes = Object.keys(PROTECTED_ROUTES)
        .filter(protectedRoute => route.startsWith(protectedRoute))
        .sort((a, b) => b.length - a.length);
    
    if (matchingRoutes.length === 0) {
        return true; // Ruta no protegida
    }
    
    const closestRoute = matchingRoutes[0];
    const allowedRoles = PROTECTED_ROUTES[closestRoute];
    
    return allowedRoles?.includes(role) ?? false;
}

/**
 * Obtiene la etiqueta legible de un rol
 */
export function getRoleLabel(role: Role): string {
    return ROLE_LABELS[role] ?? role;
}

/**
 * Valida si un string es un rol válido
 */
export function isValidRole(role: string): role is Role {
    return Object.values(ROLES).includes(role as Role);
}

/**
 * Obtiene todos los roles disponibles
 */
export function getAllRoles(): { value: Role; label: string; description: string }[] {
    return Object.values(ROLES).map(role => ({
        value: role,
        label: ROLE_LABELS[role],
        description: ROLE_DESCRIPTIONS[role]
    }));
}
