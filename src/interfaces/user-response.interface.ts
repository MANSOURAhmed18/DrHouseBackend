// src/auth/interfaces/user-response.interface.ts

import { UserRole } from "src/schemas/user.schema";

export interface UserResponse {
    _id: string;
    name: string;
    email: string;
    role: UserRole;
    isActive: boolean;
    createdAt?: Date;
}