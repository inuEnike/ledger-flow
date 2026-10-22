import type { authSigninDTO, authSignupDTO } from "./auth.schema.ts";
import type { IAuthService, IAuthRepository, PublicUser } from "./auth.types.ts";
import { BAD_REQUEST_EXCEPTION, CONFLICT_EXCEPTION, NOT_FOUND_EXCEPTION, UNAUTHORIZED_EXCEPTION } from "../../middleware/error.middleware.ts";
import argon from "argon2";
import { getBlockedEmailDomains } from "../../util/tempEmail.ts";


export class AuthService implements IAuthService {
    private readonly authRepository: IAuthRepository
    constructor(authRepository: IAuthRepository) {
        this.authRepository = authRepository
    }

    signup = async (data: authSignupDTO): Promise<{ message: "Signed up successful" }> => {

        if (!data.email) {
            throw new NOT_FOUND_EXCEPTION("No email provided")
        }

        // check for temp email
        const tempEmail = getBlockedEmailDomains()
        const stripIncomingEmail = data.email.split("@")[1]

        if (!stripIncomingEmail) {
            throw new Error("An error occurred, no incoming stripped email ")
        }
        if (tempEmail.includes(stripIncomingEmail)) {
            throw new BAD_REQUEST_EXCEPTION("You can't use a temporary email")
        }

        // check for existing email
        const existingEmail = await this.authRepository.findByEmail(data.email)

        if (existingEmail) {
            throw new CONFLICT_EXCEPTION("An account with that email already exists")
        }

        // Hashing the password
        const hashPassword = await argon.hash(data.password)

        // create the user

        await this.authRepository.createUser({
            ...data,
            password: hashPassword
        })

        return { message: "Signed up successful" }

    }

    signin = async (data: authSigninDTO): Promise<PublicUser | null> => {
        // check if the email does not exists
        const emailExists = await this.authRepository.findByEmail(data.email)
        if (!emailExists) {
            throw new UNAUTHORIZED_EXCEPTION("No account with that creadentials found, please signup")
        }

        
    }
}
