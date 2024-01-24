const farmerDB = require("../data-access/farmer.data_access");
const { BadRequestError } = require("../utilities/error");
const db_fields = ["first_name", "last_name", "phone_number", "age", "address", "crops"];


const insertFarmer = async ({ first_name, last_name, phone_number, age, address, crops }) => {
  try {
    if (!first_name || !last_name || !phone_number || !age || !address || !crops) {
      throw new BadRequestError("Please provide all fields")
    }
    await farmerDB.insert({ first_name, last_name, phone_number, age, address, crops });
    return "Record inserted successfully";
  } catch (error) {
    throw error;
  }
}

const getFarmers = async ({ fields, filters }) => {
  try {
    if (fields && !fields.split(",").every(field => db_fields.includes(field))) 
      throw new BadRequestError("Please ensure that all provided fields are valid and properly comma delimited")
    let fieldsMatched = filters?.split(",");
    if (filters && !fieldsMatched?.every(field => db_fields.includes(field.split(":")[0]))) 
      throw new BadRequestError("Please ensure that all provided fields in the filter query parameter are valid")

    let count = 1;
    let parameters = [];
    let matchQuery = [];

    fieldsMatched?.forEach(element => {
      let query = "";
      let [field, value] = element.split(":");
      if (!field || !value) return
      if (field == "age") {
        value = value.split("-");
        if (value.length > 1) {
          query += `age BETWEEN $${count++} AND $${count++}`
          parameters.push(Number(value[0]), Number(value[1]))
        } else if (value.length == 1) {
          query += `age = $${count++}`
          parameters.push(Number(value[0]))
        } else throw new BadRequestError("Please specify the age to match properly")
      } else if (field == "crops") {
        value = value.split("-");
        if (value.length == 0) return
        let cropArr = [];
        value.forEach(crop => cropArr.push(crop));
        query += `crops && $${count++}`
        parameters.push(cropArr);
      } else if (field != "address") {
        query += `${field} = $${count++}`
        parameters.push(value);
      }

      if (query !== "") matchQuery.push(query);

    });

    const res = await farmerDB.get({ fields: fields || "*", 
      filters: matchQuery.length == 0 ? "" : ` WHERE ${matchQuery.join(" AND ")}`,
      parameters 
    });
    return res;
  } catch (error) {
    throw error
  }
}

module.exports = {
  insertFarmer,
  getFarmers
}