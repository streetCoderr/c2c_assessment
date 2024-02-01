import farmerDB from "../data-access/farmer.data_access.js";
import generateRetrievalQueryParams from "../utilities/generateRetrievalQuery.js";
import { validateFarmer, validatePathQuery } from "../utilities/validator.js";


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

export {
  insertFarmer,
  getFarmers
}