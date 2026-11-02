import z from "zod";

export const createAccountDetailsSchema = z.object({
    account_id: z.string(),
    account_tier_id: z.string(),
})

export const updateAccountDetailsSchema = z.object({
    account_tier_id: z.string(),
})


export type CreateAccountDetailsDTO = z.infer<typeof createAccountDetailsSchema>
export type UpdateAccountDetailsDTO = z.infer<typeof createAccountDetailsSchema>