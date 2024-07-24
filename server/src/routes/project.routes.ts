import { Router } from "express";

import {
    createProject,
    fetchAllMyProjects,
    fetchProject,
    updateProjectName,
    updateProjectCode,
    deleteProject,
    forkProject,
} from "../controllers/project.controller";

import { isAuthenticated } from "../middlewares/auth.middleware";

const router = Router();

router.use(isAuthenticated);

router.route("/create").post(createProject);

router.route("/my").get(fetchAllMyProjects);

router.route("/my/:projectId").get(fetchProject);

router.route("/update/name").patch(updateProjectName);

router.route("/update/code").patch(updateProjectCode);

router.route("/delete/:projectId").delete(deleteProject);

router.route("/fork").post(forkProject);

export default router;
