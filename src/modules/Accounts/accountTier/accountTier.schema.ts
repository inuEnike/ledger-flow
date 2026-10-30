import z from "zod";

export const createTierSchema = z.object({
    name: z.string().min(4),
    balance_limit: z.number(),
    daily_transfer_limit: z.number(),
})
export type createTierDTO = z.infer<typeof createTierSchema>

export const updateTierSchema = z.object({
    name: z.string().min(4).optional(),
    balance_limit: z.number().optional(),
    daily_transfer_limit: z.number().optional(),
})


export type updateTierDTO = z.infer<typeof updateTierSchema>