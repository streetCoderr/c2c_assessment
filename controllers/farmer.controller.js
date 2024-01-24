const farmerService = require("../services/farmer.service");

const insertFarmer = async (req, res, next) => {
  try {
    const { first_name, last_name, phone_number, age, address, crops } = req.body;
    const result = await farmerService.insertFarmer({
      first_name, last_name, phone_number, age, address, crops
    });
    console.log(result)
    res.status(201).json({message: result});
  } catch (error) {
    next(error);
  }
}


const getFarmers = async (req, res, next) => {
  try {
    const { fields, match } = req.query;
    const result = await farmerService.getFarmers({
      fields, match
    });
    res.send(result)
  } catch (error) {
    next(error);
  }
}

module.exports = {
  insertFarmer,
  getFarmers
}