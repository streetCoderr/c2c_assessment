import { BadRequestError } from "../utilities/error.js";
import Farmer from "./farmer.schema.js";

const validateFarmer = (farmerInput) => {
  return Farmer.parse(farmerInput);
}

const validatePathQuery = ({fields, filters}) => {
  const db_fields = ["id", "first_name", "last_name", "phone_number", "age", "address", "crops"];
  if (fields && !fields.split(",").every(field => db_fields.includes(field))) 
    throw new BadRequestError("Please ensure that all provided fields are valid and properly comma delimited")
  if (filters && !filters.split(",")?.every(field => db_fields.includes(field.split(":")[0]))) 
    throw new BadRequestError("Please ensure that all provided fields in the filter query parameter are valid and in the right format")
}

export {
  validateFarmer,
  validatePathQuery
}