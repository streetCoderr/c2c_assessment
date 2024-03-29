import FarmerService from "../services/farmer.service.js";

const insertFarmer = async (req, res, next) => {
  try {
    const result = await FarmerService.insertFarmer(req.body);
    res.status(201).json({message: result});
  } catch (error) {
    next(error);
  }
}


const getFarmers = async (req, res, next) => {
  try {
    const farmers = await FarmerService.getFarmers(req.query);
    const found = farmers?.length > 0;
    res.status(found ? 200 : 404).json({farmers, message: found ? "Records retrieved successfully" : "No record found"});
  } catch (error) {
    next(error);
  }
}

export default {
  insertFarmer,
  getFarmers
}