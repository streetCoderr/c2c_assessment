import FarmerDB from "../data-access/farmer.data_access.js";
import generateRetrievalQueryParams from "../utilities/generateRetrievalQuery.js";
import Validator from "../utilities/validator.js";


const insertFarmer = async (farmer) => {
  try {
    await FarmerDB.insert(Validator.validateFarmer(farmer));
    return "Record inserted successfully";
  } catch (error) {
    throw error;
  }
}

const getFarmers = async ({ fields, filters }) => {
  try {
    Validator.validatePathQuery({fields, filters});
    const res = await FarmerDB.get(generateRetrievalQueryParams({fields, filters}));
    return res;
  } catch (error) {
    throw error
  }
}

export default {
  insertFarmer,
  getFarmers
}