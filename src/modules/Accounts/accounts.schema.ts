import z from "zod";
import { ACCOUNT_TYPE, CURRENCY } from "./accounts.types";

export const AccountSchema = z.object({
    account_type: z.enum(ACCOUNT_TYPE),
    currency: z.enum(CURRENCY)

})

export type accountDTO = z.infer<typeof AccountSchema>

export const updateAccountSchema = z.object({
    currency: z.enum(CURRENCY).optional(),
    account_type: z.enum(ACCOUNT_TYPE).optional()
})


export type updateAccountDTO = z.infer<typeof updateAccountSchema>


export const deleteAccountSchema = z.object({
    accountId: z.uuid("Invalid account ID"),
    userId: z.uuid("Invalid user ID"),
});