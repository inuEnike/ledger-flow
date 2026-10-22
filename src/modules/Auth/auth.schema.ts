import * as z from "zod"

export const AuthSignupSchema = z.object({
    email: z.email(),
    password: z.string().min(8),
    first_name: z.string().min(2),
    last_name: z.string().min(2),
})

export type authSignupDTO = z.infer<typeof AuthSignupSchema>

export const AuthSigninSchema = z.object({
    email: z.email(),
    password: z.string().min(8),
})
export type authSigninDTO = z.infer<typeof AuthSigninSchema>
