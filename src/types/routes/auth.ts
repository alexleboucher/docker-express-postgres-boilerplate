export interface AuthLoginBody {
    login: string;
    password: string;
}

export interface AuthLoginResponse {
    id: string;
    username: string;
    email: string;
}