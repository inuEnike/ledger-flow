import crypto from "node:crypto"
export const generateToken = (value: number) => {
    const token = crypto.randomBytes(value).toString("base64")
    return token
}