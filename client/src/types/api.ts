export interface ApiResponse {
    success: boolean;
    status: number;
    message: string;
}

export interface ApiError {
    success: boolean;
    status: number;
    message: string;
    errors?: { field: string; error: string }[];
}
