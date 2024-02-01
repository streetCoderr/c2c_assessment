import express from "express";
import { insertFarmer, getFarmers } from "../controllers/farmer.controller.js";
export const router = express.Router();
router.route("/").post(insertFarmer).get(getFarmers);
