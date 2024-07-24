import { Response, NextFunction } from "express";
import { Date, Document } from "mongoose";

import { AuthenticatedRequest } from "../middlewares/auth.middleware";

import { IProject, Project } from "../models/project.model";

import { createProjectSchema } from "../schemas/project/createProject.schema";
import { fetchProjectSchema } from "../schemas/project/fetchProject.schema";
import { updateProjectCodeSchema } from "../schemas/project/updateProjectCode.schema";
import { updateProjectNameSchema } from "../schemas/project/updateProjectName.schema";
import { deleteProjectSchema } from "../schemas/project/deleteProject.schema";
import { forkProjectSchema } from "../schemas/project/forkProject.schema";

import { html } from "../templates/html";
import { css } from "../templates/css";
import { javascript } from "../templates/javascript";

import { asyncHandler } from "../utils/asyncHandler";
import {
    BadRequestError,
    NotFoundError,
    UnauthorizedError,
} from "../utils/HttpError";

type ProjectType = IProject & { createdAt: Date; updatedAt: Date } & Document;

const createProject = asyncHandler(
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const body = await createProjectSchema.parseAsync(req.body);

        const { name } = body;

        const project = (await Project.create({
            name,
            code: {
                html,
                css,
                javascript,
            },
            user: req.userId,
        })) as ProjectType;

        return res.status(201).json({
            success: true,
            status: 201,
            project: {
                _id: project._id,
                name: project.name,
                code: project.code,
                user: project.user,
                createdAt: project.createdAt,
                updatedAt: project.updatedAt,
            },
            message: `A new project named '${project.name}' has been successfully created with a basic template.`,
        });
    }
);

const fetchProject = asyncHandler(
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const params = await fetchProjectSchema.parseAsync(req.params);

        const { projectId } = params;

        const project = (await Project.findById(projectId)) as ProjectType;

        if (!project) {
            throw new NotFoundError(
                `Oops! The project you're looking for cannot be found. Please check the project ID and try again.`
            );
        }

        return res.status(200).json({
            success: true,
            status: 200,
            project: {
                _id: project._id,
                name: project.name,
                code: project.code,
                user: project.user,
                createdAt: project.createdAt,
                updatedAt: project.updatedAt,
            },
            message: `Project fetched successfully.`,
        });
    }
);

const updateProjectCode = asyncHandler(
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const body = await updateProjectCodeSchema.parseAsync(req.body);

        const { projectId, code } = body;

        const project = await Project.findById(projectId);

        if (!project) {
            throw new NotFoundError(
                `Oops! The project you're looking for cannot be found. Please check the project ID and try again.`
            );
        }

        if (project.user.toString() !== req.userId?.toString()) {
            throw new UnauthorizedError(
                `Sorry, you don't have permission to update this project.`
            );
        }

        project.code.html = code.html || "";
        project.code.css = code.css || "";
        project.code.javascript = code.javascript || "";

        const updatedProject = (await project.save()) as ProjectType;

        return res.status(200).json({
            success: true,
            status: 200,
            project: {
                _id: updatedProject._id,
                name: updatedProject.name,
                code: updatedProject.code,
                user: updatedProject.user,
                createdAt: updatedProject.createdAt,
                updatedAt: updatedProject.updatedAt,
            },
            message: `The project has been updated successfully.`,
        });
    }
);

const updateProjectName = asyncHandler(
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const body = await updateProjectNameSchema.parseAsync(req.body);

        const { projectId, newName } = body;

        const project = await Project.findById(projectId);

        if (!project) {
            throw new NotFoundError(
                `Oops! The project you're looking for cannot be found. Please check the project ID and try again.`
            );
        }

        if (project.user.toString() !== req.userId?.toString()) {
            throw new UnauthorizedError(
                `Sorry, you don't have permission to update this project.`
            );
        }

        project.name = newName;

        const updatedProject = (await project.save()) as ProjectType;

        return res.status(200).json({
            success: true,
            status: 200,
            project: {
                _id: updatedProject._id,
                name: updatedProject.name,
                code: updatedProject.code,
                user: updatedProject.user,
                createdAt: updatedProject.createdAt,
                updatedAt: updatedProject.updatedAt,
            },
            message: `The project has been updated successfully.`,
        });
    }
);

const deleteProject = asyncHandler(
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const params = await deleteProjectSchema.parseAsync(req.params);

        const { projectId } = params;

        const project = await Project.findById(projectId);

        if (!project) {
            throw new NotFoundError(
                `Oops! The project you're looking for cannot be found. Please check the project ID and try again.`
            );
        }

        if (project.user.toString() !== req.userId?.toString()) {
            throw new UnauthorizedError(
                `Sorry, you don't have permission to delete this project.`
            );
        }

        await Project.deleteOne({ _id: projectId });

        return res.status(200).json({
            success: true,
            status: 200,
            message: `The project has been deleted successfully.`,
        });
    }
);

const forkProject = asyncHandler(
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const body = await forkProjectSchema.parseAsync(req.body);

        const { projectId } = body;

        const project = await Project.findById(projectId);

        if (!project) {
            throw new NotFoundError(
                `Oops! The project you're looking for cannot be found. Please check the project ID and try again.`
            );
        }

        if (project.user.toString() === req.userId?.toString()) {
            throw new BadRequestError(
                `It looks like you're trying to fork your own project. You can only fork projects created by others.`
            );
        }

        const forkedProject = (await Project.create({
            name: project.name,
            code: project.code,
            user: req.userId,
        })) as ProjectType;

        return res.status(201).json({
            success: true,
            status: 201,
            project: {
                _id: forkedProject._id,
                name: forkedProject.name,
                code: forkedProject.code,
                user: forkedProject.user,
                createdAt: forkedProject.createdAt,
                updatedAt: forkedProject.updatedAt,
            },
            message: `The project has been forked successfully.`,
        });
    }
);

const fetchAllMyProjects = asyncHandler(
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const projects = await Project.find({ user: req.userId })
            .sort({
                updatedAt: -1,
            })
            .select("name createdAt updatedAt");

        return res.status(200).json({
            success: true,
            status: 200,
            totalProjects: projects.length,
            projects,
            message: `Projects fetched successfully.`,
        });
    }
);

export {
    createProject,
    fetchProject,
    updateProjectCode,
    updateProjectName,
    deleteProject,
    forkProject,
    fetchAllMyProjects,
};
