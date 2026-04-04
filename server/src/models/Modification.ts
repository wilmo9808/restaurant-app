export interface Modification {
    id: string;
    name: string;
    price: number;
    productId: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ModificationCreateInput {
    name: string;
    price: number;
    productId: string;
}

export interface ModificationUpdateInput {
    name?: string;
    price?: number;
    productId?: string;
}

export interface ModificationResponse {
    id: string;
    name: string;
    price: number;
    productId: string;
}

export interface OrderModificationApplied {
    modifierId: string;
    modifierName: string;
    price: number;
}