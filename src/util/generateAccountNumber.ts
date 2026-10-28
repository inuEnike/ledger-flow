import crypto from "node:crypto"

export const generateAccountNumber = () => {
    return crypto.randomInt(0, 10_000_000_000)
        .toString()
        .padStart(10, "0");;
}