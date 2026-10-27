import z from "zod";
import { ACCOUNT_TYPE, CURRENCY } from "./accounts.types";

const AccountSchema = z.object({
    account_type: z.enum(ACCOUNT_TYPE),
    currency: z.enum(CURRENCY)

})

export type accountDTO = z.infer<typeof AccountSchema>