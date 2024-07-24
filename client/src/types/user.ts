import { ApiResponse } from "./api";

export interface User {
    _id: string;
    name: string;
    username: string;
    email: string;
}

export interface UserApiResponse extends ApiResponse {
    user: User;
}

export interface UserSignupRequest {
    name: string;
    username: string;
    email: string;
    password: string;
}

export interface UserSigninRequest {
    identifier: string;
    password: string;
}
