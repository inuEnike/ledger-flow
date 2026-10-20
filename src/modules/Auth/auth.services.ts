import { tempMail, tempMails } from "../../util/tempEmail";
import type { authSignupDTO } from "./auth.schema";
import type { IAuthController, IAuthRepository } from "./auth.types";


export class AuthController implements IAuthController {
    private readonly authRepository: IAuthRepository
    constructor(authRepository: IAuthRepository) {
        this.authRepository = authRepository
    }

    // signup = async (data: authSignupDTO): Promise<{ data: "Signed up successful" }> => {

    //     // check for temp email

    // }

}
