export interface SarlaftFormData {
    id?: string;
    userId: string;
    createdAt?: string;
    updatedAt?: string;
    
    // Información básica
    dateCompleted: string;
    city: string;
    
    // Persona Natural - Información básica
    naturalPerson: {
        primerNombre: string;
        segundoNombre?: string;
        primerApellido: string;
        segundoApellido?: string;
        tipoDocumento: string;
        numeroDocumento: string;
        fechaNacimiento: string;
        lugarNacimiento: string;
        nacionalidad: string;
        genero: string;
        estadoCivil: string;
        telefono: string;
        celular?: string;
        email: string;
        direccion: string;
        ciudad: string;
        pais: string;
        codigoPostal?: string;
    };
    
    // Información financiera
    informacionFinanciera: {
        ingresosMensuales: number;
        otrosIngresos: number;
        egresos: number;
        activos: number;
        pasivos: number;
        patrimonio: number;
        origenIngresos: string;
        descripcionOrigen?: string;
        monedaOperacion: string;
    };
    
    // Información laboral
    informacionLaboral: {
        empresa: string;
        cargo: string;
        tiempoVinculacion: string;
        direccionEmpresa: string;
        ciudadEmpresa: string;
        paisEmpresa: string;
        telefonoEmpresa: string;
        actividadEconomica: string;
        regimenTributario: string;
    };
    
    // Preguntas SARLAFT específicas
    preguntasSarlaft: {
        // PEP (Persona Expuesta Políticamente)
        esPep: boolean;
        relacionadoPep: boolean;
        detallePep?: string;
        
        // Transacciones en efectivo
        transaccionesEfectivo: boolean;
        montoMaximoEfectivo?: number;
        frecuenciaEfectivo?: string;
        
        // Cuentas en el exterior
        cuentasExterior: boolean;
        detallesCuentasExterior?: Array<{
            pais: string;
            entidad: string;
            tipoCuenta: string;
            proposito: string;
        }>;
        
        // Investigaciones penales o disciplinarias
        investigacionesPenales: boolean;
        detalleInvestigaciones?: string;
        
        // Operaciones en paraísos fiscales
        operacionesParaisosFiscales: boolean;
        detalleParaisosFiscales?: string;
        
        // Administración de recursos de terceros
        administraRecursosTerceros: boolean;
        detalleRecursosTerceros?: string;
        
        // Reportes a UIF
        reportesUIF: boolean;
        detalleReportesUIF?: string;
        
        // Vinculación con actividades de alto riesgo
        actividadesAltoRiesgo: boolean;
        detalleActividadesRiesgo?: string;
        
        // Referencias comerciales
        referenciasComerciales: Array<{
            entidad: string;
            telefono: string;
            tipoProducto: string;
            tiempoVinculacion: string;
        }>;
        
        // Referencias personales
        referenciasPersonales: Array<{
            nombre: string;
            telefono: string;
            relacion: string;
            tiempoConocimiento: string;
        }>;
    };
    
    // Autorizaciones y declaraciones
    autorizaciones: {
        // Tratamiento de datos personales
        autorizacionDatos: boolean;
        fechaAutorizacionDatos?: string;
        
        // Consultas en centrales de riesgo
        autorizacionCentrales: boolean;
        fechaAutorizacionCentrales?: string;
        
        // Envío de información por medios electrónicos
        autorizacionEmail: boolean;
        
        // Declaración de veracidad
        declaracionVeracidad: boolean;
        fechaDeclaracion?: string;
    };
    
    // Firmas y validaciones
    firmas: {
        firmaCliente?: string; // Base64 de la firma
        nombreFirmante: string;
        documentoFirmante: string;
        fechaFirma: string;
        
        // Validación por parte de la entidad
        validadorNombre?: string;
        validadorCargo?: string;
        fechaValidacion?: string;
        observaciones?: string;
    };
}

export interface SarlaftListItem {
    id: string;
    userId: string;
    dateCompleted: string;
    naturalPerson: {
        primerNombre: string;
        primerApellido: string;
        numeroDocumento: string;
    };
    createdAt: string;
    updatedAt: string;
    status: 'draft' | 'completed' | 'validated';
}

export interface SarlaftValidation {
    field: string;
    message: string;
    type: 'error' | 'warning' | 'info';
}

export interface SarlaftExportOptions {
    format: 'excel' | 'pdf';
    includeSignatures: boolean;
    templateVersion: string;
}