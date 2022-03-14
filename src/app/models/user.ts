export class User {
    id: number;
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    access_token?: string;
    token_received?: number;
    expires_in?: number;
    token_origin?: number;
}
