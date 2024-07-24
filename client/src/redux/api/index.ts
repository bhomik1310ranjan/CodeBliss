import {
    CreateProjectRequest,
    FetchAllMyProjectsApiResponse,
    ForkAProjectRequest,
    ProjectApiResponse,
    UpdateProjectCodeRequest,
    UpdateProjectNameRequest,
} from "../../types/project";
import { ApiResponse } from "../../types/api";
import {
    UserApiResponse,
    UserSigninRequest,
    UserSignupRequest,
} from "../../types/user";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const CodeBlissApi = createApi({
    reducerPath: "codeblissApi",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_SERVER_URL,
    }),
    tagTypes: ["Project"],
    endpoints: (builder) => ({
        signup: builder.mutation<UserApiResponse, UserSignupRequest>({
            query: (user) => ({
                url: "/api/users/signup",
                method: "POST",
                body: user,
            }),
        }),
        signin: builder.mutation<UserApiResponse, UserSigninRequest>({
            query: (credentials) => ({
                url: "/api/users/signin",
                method: "POST",
                body: credentials,
                credentials: "include",
            }),
        }),
        profile: builder.query<UserApiResponse, void>({
            query: () => ({
                url: "/api/users/profile",
                credentials: "include",
            }),
        }),
        signout: builder.mutation<ApiResponse, void>({
            query: () => ({
                url: "/api/users/signout",
                method: "POST",
                credentials: "include",
            }),
            invalidatesTags: ["Project"],
        }),
        createProject: builder.mutation<
            ProjectApiResponse,
            CreateProjectRequest
        >({
            query: (requestBody) => ({
                url: "/api/projects/create",
                method: "POST",
                body: requestBody,
                credentials: "include",
            }),
            invalidatesTags: ["Project"],
        }),
        getAllMyProjects: builder.query<FetchAllMyProjectsApiResponse, void>({
            query: () => ({
                url: "/api/projects/my",
                credentials: "include",
            }),
            providesTags: ["Project"],
        }),
        getAProject: builder.query<ProjectApiResponse, string>({
            query: (projectId) => ({
                url: `/api/projects/my/${projectId}`,
                credentials: "include",
            }),
            providesTags: ["Project"],
        }),
        updateProjectName: builder.mutation<
            ProjectApiResponse,
            UpdateProjectNameRequest
        >({
            query: (requestBody) => ({
                url: "/api/projects/update/name",
                method: "PATCH",
                body: requestBody,
                credentials: "include",
            }),
            invalidatesTags: ["Project"],
        }),
        updateProjectCode: builder.mutation<
            ProjectApiResponse,
            UpdateProjectCodeRequest
        >({
            query: (requestBody) => ({
                url: "/api/projects/update/code",
                method: "PATCH",
                body: requestBody,
                credentials: "include",
            }),
            invalidatesTags: ["Project"],
        }),
        deleteAProject: builder.mutation<ApiResponse, string>({
            query: (projectId) => ({
                url: `/api/projects/delete/${projectId}`,
                method: "DELETE",
                credentials: "include",
            }),
            invalidatesTags: ["Project"],
        }),
        forkAProject: builder.mutation<ProjectApiResponse, ForkAProjectRequest>(
            {
                query: (requestBody) => ({
                    url: "/api/projects/fork",
                    method: "POST",
                    body: requestBody,
                    credentials: "include",
                }),
                invalidatesTags: ["Project"],
            }
        ),
    }),
});

export const {
    useSignupMutation,
    useSigninMutation,
    useProfileQuery,
    useSignoutMutation,
    useCreateProjectMutation,
    useGetAllMyProjectsQuery,
    useGetAProjectQuery,
    useUpdateProjectNameMutation,
    useUpdateProjectCodeMutation,
    useDeleteAProjectMutation,
    useForkAProjectMutation,
} = CodeBlissApi;
