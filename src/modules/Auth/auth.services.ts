import type { authSigninDTO, authSignupDTO } from "./auth.schema.ts";
import type { IAuthService, IAuthRepository, PublicUser, SigninReturnType, IRefreshSession, ITokenRepository } from "./auth.types.ts";
import { BAD_REQUEST_EXCEPTION, CONFLICT_EXCEPTION, NOT_FOUND_EXCEPTION, UNAUTHORIZED_EXCEPTION } from "../../middleware/error.middleware.ts";
import argon from "argon2";
import { getBlockedEmailDomains } from "../../util/tempEmail.ts";
import { TokenService } from "./token.service.ts";
import jwt from "jsonwebtoken";
import { ENV } from "../../util/dotenv.ts";



export class AuthService implements IAuthService {
    private readonly authRepository: IAuthRepository
    private readonly tokenRepository: ITokenRepository
    constructor(authRepository: IAuthRepository, tokenRepository: ITokenRepository) {
        this.authRepository = authRepository
        this.tokenRepository = tokenRepository
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

    signin = async (data: authSigninDTO): Promise<SigninReturnType> => {

        // check if the email does not exists
        const user = await this.authRepository.findByEmail(data.email)

        if (!user) {
            throw new UNAUTHORIZED_EXCEPTION("No account with that creadentials found, please signup")
        }
        // compare passwords
        const isPasswordValid = await argon.verify(user.password_hash, data.password)
        if (!isPasswordValid) {
            throw new UNAUTHORIZED_EXCEPTION("Invalid email or password")
        }

        const sessionId = TokenService.createSessionId();

        const accessToken = TokenService.generateAccessToken(user.id)
        const refreshToken = TokenService.generateRefreshToken(user.id, sessionId)

        const hashedRefreshToken = await argon.hash(refreshToken)

        const expirationTime = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        await this.tokenRepository.createRefreshSession({
            id: sessionId,
            expires_at: expirationTime,
            token_hash: hashedRefreshToken,
            user_id: user.id
        })
        const publicUser: PublicUser = {
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            status: user.status,
            email_verified_at: user.email_verified_at,
            created_at: user.created_at,
            updated_at: user.updated_at
        }

        return {
            accessToken,
            refreshToken,
            user: publicUser

        }

    }


    refresh = async (refreshToken: string) => {
        // 1. Ensure a refresh token was provided.
        if (!refreshToken) {
            throw new UNAUTHORIZED_EXCEPTION(
                "Refresh token is required",
            );
        }



        // 2. Check server configuration.
        // This is a server error, not a client error.
        if (!ENV.REFRESH_TOKEN_SECRET) {
            throw new Error("REFRESH_TOKEN_SECRET is not configured");
        }

        // 3. Verify the JWT.
        let payload: jwt.JwtPayload;

        try {
            const verified = jwt.verify(
                refreshToken,
                ENV.REFRESH_TOKEN_SECRET,
                {
                    issuer: "ledgerflow-auth",
                },
            );

            if (typeof verified === "string") {
                throw new Error("Invalid token payload");
            }

            payload = verified;
        } catch (error) {
            throw new UNAUTHORIZED_EXCEPTION(
                error as string
            );
        }

        // 4. Validate required claims.
        if (
            payload.type !== "refresh" ||
            typeof payload.sub !== "string" ||
            typeof payload.sid !== "string"
        ) {
            throw new UNAUTHORIZED_EXCEPTION(
                "Invalid refresh token payload",
            );
        }

        // 5. Find the session using the sid from the JWT.
        const session = await this.tokenRepository.findSessionById(
            payload.sid,
        );

        if (!session) {
            throw new UNAUTHORIZED_EXCEPTION(
                "Invalid refresh session",
            );
        }

        // 6. Validate the session.
        if (
            session.user_id !== payload.sub ||
            session.revoked_at !== null ||
            new Date(session.expires_at).getTime() <= Date.now()
        ) {
            throw new UNAUTHORIZED_EXCEPTION(
                "Invalid refresh session",
            );
        }

        // 7. Verify the presented token against its stored hash.
        const isTokenValid = await argon.verify(
            session.token_hash,
            refreshToken,
        );

        if (!isTokenValid) {
            throw new UNAUTHORIZED_EXCEPTION(
                "Invalid refresh token",
            );
        }

        // 8. Generate new tokens for the same user and session.
        const accessToken = TokenService.generateAccessToken(
            session.user_id,
        );

        const newRefreshToken = TokenService.generateRefreshToken(
            session.user_id,
            session.id,
        );

        // 9. Hash the new refresh token.
        const newTokenHash = await argon.hash(newRefreshToken);

        // 10. Rotate the stored hash conditionally.
        const updatedSession =
            await this.tokenRepository.updateSessionTokenHash(
                session.id,
                session.token_hash,
                newTokenHash,
            );

        if (!updatedSession) {
            throw new UNAUTHORIZED_EXCEPTION(
                "Refresh token is no longer valid",
            );
        }

        // 11. Return both tokens to the controller.
        return {
            accessToken,
            refreshToken: newRefreshToken,
        };
    };

}

