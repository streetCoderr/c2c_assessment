const farmerDB = require("../data-access/farmer.data_access");
const generateRetrievalQueryParams = require("../utilities/generateRetrievalQuery");
const validateFarmer = require("../utilities/validator");
const db_fields = ["first_name", "last_name", "phone_number", "age", "address", "crops"];


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
    if (fields && !fields.split(",").every(field => db_fields.includes(field))) 
      throw new BadRequestError("Please ensure that all provided fields are valid and properly comma delimited")
    if (filters && !filters.split(",")?.every(field => db_fields.includes(field.split(":")[0]))) 
      throw new BadRequestError("Please ensure that all provided fields in the filter query parameter are valid")

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