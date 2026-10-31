import z from "zod";

const createAccountDetailsSchema = z.object({
    account_id: z.string(),
    account_tier_id: z.string(),
})


export type CreateAccountDetailsDTO = z.infer<typeof createAccountDetailsSchema>