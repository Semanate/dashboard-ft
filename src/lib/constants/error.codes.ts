export const ErrorCodes = {
    MISSING_FIELDS: {
        code: "MISSING_FIELDS",
        message: "Todos los campos son ${message}"
    },

    PASSWORD_MISMATCH: {
        code: "PASSWORD_MISMATCH",
        message: "Las contraseñas no coinciden"
    },

    SUPABASE_SIGNUP_ERROR: {
        code: "SUPABASE_SIGNUP_ERROR",
        message: "Hubo un error al crear la cuenta"
    },

    INVALID_CREDENTIALS: {
        code: "INVALID_CREDENTIALS",
        message: "Las credenciales son incorrectas"
    },

    USER_NOT_FOUND: {
        code: "USER_NOT_FOUND",
        message: "No existe un usuario con este correo"
    }
} as const;
