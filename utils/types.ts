import {SessionBase} from "next-auth/_utils";

export interface SessionObj extends SessionBase {
    userId: number,
}

export interface UserObj {
    id: number,
    email: string,
    name: string,
    image?: string,
    leagues?: number[],
}