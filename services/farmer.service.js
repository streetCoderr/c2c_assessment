const farmerDB = require("../data-access/farmer.data_access");
const generateRetrievalQueryParams = require("../utilities/generateRetrievalQuery");
const { validateFarmer, validatePathQuery }= require("../utilities/validator");


const insertFarmer = async (farmer) => {
  try {
    await farmerDB.insert(validateFarmer(farmer));
    return "Record inserted successfully";
  } catch (error) {
    throw error;
  }
}

const getFarmers = async ({ fields, filters }) => {
  try {
    validatePathQuery({fields, filters});
    const res = await farmerDB.get(generateRetrievalQueryParams({fields, filters}));
    return res;
  } catch (error) {
    throw error
  }
}

module.exports = {
  insertFarmer,
  getFarmers
}