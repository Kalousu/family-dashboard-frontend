export type StatusResponse = 
    | { role: "NONE" }
    | { role: "SYSADMIN" }
    | { role: "USER" }
    | { role: "FAMILY" }

export interface LoginRequest {
    name: string,
    password: string
}

export interface UserSelectRequest {
    userId: number,
    pin?: string
}

export interface FamilyLoginResponse {
    role: "FAMILY";
    familyId: number;
    profiles: UserProfile[];
}

export interface UserProfile {
    id: number,
    name:string,
    avatar: string,
    avatarType: UserAvatarType,
    role: UserRole,
    hasPin: boolean,
    color: string
}

export type UserAvatarType =
    | "URL"
    | "ICON"

export type UserRole = 
    | "USER"
    | "FAMILY_ADMIN"
    | "SYSTEM_ADMIN"

export interface SysAdminLoginResponse {
    role: "SYSADMIN";
}

export type LoginResponse = FamilyLoginResponse | SysAdminLoginResponse;
