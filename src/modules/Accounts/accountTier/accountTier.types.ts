import type { createTierDTO, updateTierDTO } from "./accountTier.schema"

export interface IAccountTier {
    id: string
    name: string
    balance_limit: number
    daily_transfer_limit: number
    created_at: string
    updated_at: string
}

export interface IAccountTierRepository {
    getAllTier: () => Promise<IAccountTier[]>
    getTierById: (id: string) => Promise<IAccountTier | undefined>
    createTier: (data: createTierDTO) => Promise<IAccountTier[]>
    updateTierById: (data: updateTierDTO, id: string) => Promise<IAccountTier | undefined>
    deleteTierById: (id: string) => Promise<IAccountTier | undefined>
}