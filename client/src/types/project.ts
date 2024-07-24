import { ApiResponse } from "./api";

export interface Project {
    _id: string;
    name: string;
    code: {
        html: string;
        css: string;
        javascript: string;
    };
    user: string;
    createdAt: string;
    updatedAt: string;
}

export interface ProjectApiResponse extends ApiResponse {
    project: Project;
}

export interface FetchAllMyProjectsApiResponse extends ApiResponse {
    totalProjects: number;
    projects: {
        _id: string;
        name: string;
        createdAt: string;
        updatedAt: string;
    }[];
}

export interface CreateProjectRequest {
    name: string;
}

export interface UpdateProjectNameRequest {
    projectId: string;
    newName: string;
}

export interface UpdateProjectCodeRequest {
    projectId: string;
    code: {
        html?: string;
        css?: string;
        javascript?: string;
    };
}

export interface ForkAProjectRequest {
    projectId: string;
}
