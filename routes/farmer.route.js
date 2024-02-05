import express from "express";
import FarmerController from "../controllers/farmer.controller.js";
const router = express.Router();
router.route("/").post(FarmerController.insertFarmer).get(FarmerController.getFarmers);
export default router
