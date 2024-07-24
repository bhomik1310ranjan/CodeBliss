import { Router } from "express";

import {
    signup,
    signin,
    signout,
    fetchUserProfile,
} from "../controllers/user.controller";

import { isAuthenticated } from "../middlewares/auth.middleware";

const router = Router();

router.route("/signup").post(signup);

router.route("/signin").post(signin);

router.use(isAuthenticated);

router.route("/signout").post(signout);

router.route("/profile").get(fetchUserProfile);

export default router;
