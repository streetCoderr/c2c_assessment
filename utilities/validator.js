const { BadRequestError } = require("../utilities/error");
const Farmer = require("./farmer.schema");

const validateFarmer = (farmerInput) => {
  return Farmer.parse(farmerInput);
}

const validatePathQuery = ({fields, filters}) => {
  const db_fields = ["first_name", "last_name", "phone_number", "age", "address", "crops"];
  if (fields && !fields.split(",").every(field => db_fields.includes(field))) 
    throw new BadRequestError("Please ensure that all provided fields are valid and properly comma delimited")
  if (filters && !filters.split(",")?.every(field => db_fields.includes(field.split(":")[0]))) 
    throw new BadRequestError("Please ensure that all provided fields in the filter query parameter are valid")
}

module.exports = {
  validateFarmer,
  validatePathQuery
}