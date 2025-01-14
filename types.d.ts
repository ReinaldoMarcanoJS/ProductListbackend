export type Product = {
        id?: number;
        name: string;
        price: number;
        description: string;
        createdAt: Date;
        updatedAt: Date;
};

export type User = {
    id: number;
    name: string;
    email: string;
    password?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
