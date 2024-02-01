import farmerService from "../services/farmer.service.js";

const insertFarmer = async (req, res, next) => {
  try {
    const result = await farmerService.insertFarmer(req.body);
    res.status(201).json({message: result});
  } catch (error) {
    next(error);
  }
}


const getFarmers = async (req, res, next) => {
  try {
    const farmers = await farmerService.getFarmers(req.query);
    res.status(200).json({farmers, message: "Successfully retrieved"});
  } catch (error) {
    next(error);
  }
}

export  {
  insertFarmer,
  getFarmers
}