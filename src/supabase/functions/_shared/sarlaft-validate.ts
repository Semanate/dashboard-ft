import { z } from "https://esm.sh/zod@3.23.8";

/** Utilidades */
const nonEmpty = z.string().trim().min(1, "Campo requerido");

const isoDateLike = z
    .string()
    .trim()
    .refine((v) => /^\d{4}-\d{2}-\d{2}T/.test(v) || /^\d{4}-\d{2}-\d{2}$/.test(v), {
        message: "Fecha inválida (esperado ISO)",
    });

const docNumber = z
    .string()
    .trim()
    .min(3, "Número de documento muy corto")
    .max(50, "Número de documento muy largo");

const money = z.number().finite().min(0, "No puede ser negativo");

/** Sub-esquemas */
const RepresentativeSchema = z.object({
    firstName: z.string().optional().nullable(),
    lastName1: z.string().optional().nullable(),
    lastName2: z.string().optional().nullable(),
    typeDoc: z.string().optional().nullable(),
    docNumber: z.string().optional().nullable(),
    phone: z.string().optional().nullable(),
    email: z.string().email("Email inválido").optional().nullable().or(z.literal("")),
    city: z.string().optional().nullable(),
    activitySector: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
});

const NaturalPersonSchema = z.object({
    firstName: z.string().optional().nullable(),
    lastName1: z.string().optional().nullable(),
    lastName2: z.string().optional().nullable(),
    typeDoc: z.string().optional().nullable(),
    docNumber: z.string().optional().nullable(),
    dateOfBirth: z.string().optional().nullable(),
    placeOfBirth: z.string().optional().nullable(),
    phone: z.string().optional().nullable(),
    email: z.string().email("Email inválido").optional().nullable().or(z.literal("")),
    city: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
    activitySector: z.string().optional().nullable(),
    nationality: z.string().optional().nullable(),
    gender: z.string().optional().nullable(),
    civilStatus: z.string().optional().nullable(),
    cellPhone: z.string().optional().nullable(),
    country: z.string().optional().nullable(),
    postalCode: z.string().optional().nullable(),
});

const FinancialInfoSchema = z.object({
    monthlyIncome: money,
    otherIncome: money,
    monthlyExpenses: money,
    assets: money,
    liabilities: money,
    patrimony: money,
    incomeSource: z.string().optional().nullable(),
    incomeSourceDescription: z.string().optional().nullable(),
    operationCurrency: nonEmpty,
});

const PepSchema = z.object({
    managePublicResources: z.string().optional().nullable(),
    publicPower: z.string().optional().nullable(),
    relation: z.string().optional().nullable(),
    relationName: z.string().optional().nullable(),
    taxObligations: z.string().optional().nullable(),
    isPep: z.boolean(),
    pepRelated: z.boolean(),
    pepDetails: z.string().optional().nullable(),
    criminalInvestigations: z.boolean(),
    investigationDetails: z.string().optional().nullable(),
    taxHavenOperations: z.boolean(),
    taxHavenDetails: z.string().optional().nullable(),
    thirdPartyResources: z.boolean(),
    thirdPartyDetails: z.string().optional().nullable(),
    uifReports: z.boolean(),
    uifDetails: z.string().optional().nullable(),
    highRiskActivities: z.boolean(),
    riskDetails: z.string().optional().nullable(),
});

const RelationItemSchema = z.object({
    typeDoc: z.string().optional().nullable(),
    docNumber: z.string().optional().nullable(),
    socialName: z.string().optional().nullable(),
    percentageParticipation: z.string().optional().nullable(),
    activityAdminResource: z.string().optional().nullable(),
    activityReputationGradePublic: z.string().optional().nullable(),
});

const AccountEntityItemSchema = z.object({
    accountType: z.string().optional().nullable(),
    accountNumber: z.string().optional().nullable(),
    accountNameEntity: z.string().optional().nullable(),
});

const CommercialRefSchema = z.object({
    entity: z.string().optional().nullable(),
    phone: z.string().optional().nullable(),
    productType: z.string().optional().nullable(),
    relationshipTime: z.string().optional().nullable(),
});

const PersonalRefSchema = z.object({
    name: z.string().optional().nullable(),
    phone: z.string().optional().nullable(),
    relationship: z.string().optional().nullable(),
    knowledgeTime: z.string().optional().nullable(),
});

const ForeignCurrencySchema = z.object({
    management: z.string().optional().nullable(),
    products: z
        .array(
            z.object({
                type: z.string().optional().nullable(),
                entity: z.string().optional().nullable(),
                country: z.string().optional().nullable(),
                currency: z.string().optional().nullable(),
            })
        )
        .optional()
        .default([]),
});

const SarlaftPayloadSchema = z
    .object({
        dateAggrement: isoDateLike.optional(),
        dateAgreement: isoDateLike.optional(),

        cityAggrement: nonEmpty.optional(),
        cityAgreement: nonEmpty.optional(),

        city: nonEmpty,
        typeDocument: nonEmpty,
        documentNumber: docNumber,

        representative: RepresentativeSchema.optional().default({}),
        naturalPerson: NaturalPersonSchema.optional().default({}),
        financialInfo: FinancialInfoSchema,
        pep: PepSchema,
        relations: z.array(RelationItemSchema).optional().default([]),
        accountEntityFinancials: z.array(AccountEntityItemSchema).optional().default([]),
        commercialReferences: z.array(CommercialRefSchema).optional().default([]),
        personalReferences: z.array(PersonalRefSchema).optional().default([]),
        foreignCurrency: ForeignCurrencySchema.optional().default({ management: "", products: [] }),

        status: z.enum(["draft", "submitted", "approved", "rejected"]).optional(),
    })
    .superRefine((val, ctx) => {
        if (!val.dateAggrement && !val.dateAgreement) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "dateAggrement/dateAgreement es requerido",
                path: ["dateAggrement"],
            });
        }

        if (!val.cityAggrement && !val.cityAgreement) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "cityAggrement/cityAgreement es requerido",
                path: ["cityAggrement"],
            });
        }
    });

export function validateAndNormalizeSarlaft(input: unknown) {
    const parsed = SarlaftPayloadSchema.safeParse(input);

    if (!parsed.success) {
        const errors = parsed.error.issues.map((i) => ({
            path: i.path.join("."),
            message: i.message,
        }));
        return { ok: false as const, errors };
    }

    const p = parsed.data;

    const normalized = {
        ...p,
        dateAgreement: p.dateAgreement ?? p.dateAggrement!,
        cityAgreement: p.cityAgreement ?? p.cityAggrement!,
        status: "draft",
    };

    return { ok: true as const, value: normalized };
}
