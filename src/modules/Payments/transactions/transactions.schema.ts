import { z } from "zod"

export const transferFundsSchema = z.object({
    service_account_id: z.uuid("Invalid sender account ID"),

    destination_account_id: z.uuid("Invalid destination account ID"),

    amount: z.number()
        .min(20, "Minimum transfer amount is 20 naira"),
    pin: z.string().min(4).max(4)
})
    .refine(
        (data) => data.service_account_id !== data.destination_account_id,
        {
            message: "You cannot transfer to the same account",
            path: ["destination_account_id"]
        }
    )