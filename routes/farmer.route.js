import express from "express";
import { insertFarmer, getFarmers } from "../controllers/farmer.controller.js";
const router = express.Router();
router.route("/").post(insertFarmer).get(getFarmers);
export default router
