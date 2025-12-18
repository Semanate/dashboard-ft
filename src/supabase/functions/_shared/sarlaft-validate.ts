/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "https://esm.sh/zod@3.23.8";

const nonEmpty = z.string().trim().min(1, "Campo requerido");

const isoDateLike = z
    .string()
    .trim()
    .refine((v) => /^\d{4}-\d{2}-\d{2}T/.test(v) || /^\d{4}-\d{2}-\d{2}$/.test(v), {
        message: "Fecha inválida (ISO esperado)",
    });

const StatusSchema = z.enum(["draft", "submitted", "approved", "rejected"]);

const RepresentativeSchema = z.object({
    firstName: z.string().optional().nullable(),
    lastName1: z.string().optional().nullable(),
    lastName2: z.string().optional().nullable(),
    typeDoc: z.string().optional().nullable(),
    docNumber: z.string().optional().nullable(),
    phone: z.string().optional().nullable(),
    email: z.string().optional().nullable(),
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
    email: z.string().optional().nullable(),
    city: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
    activitySector: z.string().optional().nullable(),
});

const JuridicalPersonSchema = z.object({
    businessName: z.string().optional().nullable(),
    nit: z.string().optional().nullable(),
    phone: z.string().optional().nullable(),
    email: z.string().optional().nullable(),
    email2: z.string().optional().nullable(),
    city: z.string().optional().nullable(),
    phone2: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
    address2: z.string().optional().nullable(),
    activitySector: z.string().optional().nullable(),
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

const PepSchemaV2 = z.object({
    managePublicResources: z.string().optional().nullable(),
    publicPower: z.string().optional().nullable(),
    relation: z.string().optional().nullable(),
    relationName: z.string().optional().nullable(),
    taxObligations: z.string().optional().nullable(),
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

const SignatureSchema = z.object({
    name: z.string().optional().nullable(),
    document: z.string().optional().nullable(),
    signature: z.string().optional().nullable(),
});

const VerificationBlockSchema = z.object({
    name: z.string().optional().nullable(),
    signature: z.string().optional().nullable(),
    date: z.string().optional().nullable(),
    time: z.string().optional().nullable(),
    auth: z.string().optional().nullable(),
});

const TwoBlocksSchema = z.object({
    block1: VerificationBlockSchema.optional().default({}),
    block2: VerificationBlockSchema.optional().default({}),
});

const SarlaftPayloadSchemaV2 = z
    .object({
        dateAggrement: isoDateLike,
        cityAggrement: nonEmpty,
        typePersonAggrement: z.enum(["NAT", "JUR"]),
        status: StatusSchema.optional().default("draft"),

        representative: RepresentativeSchema.optional().default({}),
        naturalPerson: NaturalPersonSchema.optional().default({}),
        juridicalPerson: JuridicalPersonSchema.optional().default({}),

        relations: z.array(RelationItemSchema).optional().default([]),
        accountEntityFinancials: z.array(AccountEntityItemSchema).optional().default([]),

        pep: PepSchemaV2.optional().default({}),
        foreignCurrency: ForeignCurrencySchema.optional().default({ management: "", products: [] }),
        signature: SignatureSchema.optional().default({}),
        verification: TwoBlocksSchema.optional().default({ block1: {}, block2: {} }),
        pepAuthorization: TwoBlocksSchema.optional().default({ block1: {}, block2: {} }),
    })
    .superRefine((val, ctx) => {
        if (val.typePersonAggrement === "NAT") {
            if (!val.naturalPerson?.firstName?.trim()) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["naturalPerson", "firstName"],
                    message: "Requerido para persona NAT",
                });
            }

            // Si quieres obligar documento para NAT, descomenta:
            // if (!val.naturalPerson?.typeDoc?.trim()) {
            //   ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["naturalPerson","typeDoc"], message: "Requerido" });
            // }
            // if (!val.naturalPerson?.docNumber?.trim()) {
            //   ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["naturalPerson","docNumber"], message: "Requerido" });
            // }
        }

        if (val.typePersonAggrement === "JUR") {
            if (!val.juridicalPerson?.nit?.trim()) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["juridicalPerson", "nit"],
                    message: "NIT requerido para persona JUR",
                });
            }

            // if (!val.juridicalPerson?.businessName?.trim()) {
            //   ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["juridicalPerson","businessName"], message: "Requerido" });
            // }
        }
    });

export function validateAndNormalizeSarlaft(input: unknown) {
    const parsed = SarlaftPayloadSchemaV2.safeParse(input);

    if (!parsed.success) {
        const errors = parsed.error.issues.map((i: any) => ({
            path: i.path.join("."),
            message: i.message,
        }));
        return { ok: false as const, errors };
    }

    const value = { ...parsed.data, status: "draft" as const };

    return { ok: true as const, value };
}
