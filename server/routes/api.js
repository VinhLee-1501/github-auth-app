import express from "express";
import * as authController from "../controllers/authController.js";
import * as githubController from "../controllers/githubController.js";

const router = express.Router();
// User Auth
router.post("/createUser", authController.createUser);
router.post("/createNewAccessCode", authController.createNewAccessCode);
router.post("/validateAccessCode", authController.validateAccessCode);
router.post("/likeGithubUser", authController.likeGithubUser);
router.get("/getUserProfile", authController.getUserProfile);

// Github
router.get("/searchGithubUsers", githubController.searchGithubUsers);
router.get("/findGithubUserProfile", githubController.findGithubUserProfile);

export default router;
