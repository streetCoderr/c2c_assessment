import { BadRequestError } from "../utilities/error.js";

export default ({fields, filters}) => {
  
  
  let count = 1;
  let parameters = [];
  let filtersArray = [];
  
  filters?.split(",")?.forEach(element => {
    let query = "";
    let [field, value] = element.split(":");
    if (!field || !value) return
    if (field == "age") {
      value = value.split("-");
      if (value.length == 2) {
        if (isNaN(Number(value[0])) || isNaN(Number(value[1]))) throw new BadRequestError("Please insert a valid age range")
        query = `age BETWEEN $${count++} AND $${count++}`
        parameters.push(Number(value[0]), Number(value[1]))
      } else if (value.length == 1) {
        if (isNaN(Number(value[0]))) throw new BadRequestError("Please insert a valid age")
        query = `age = $${count++}`
        parameters.push(Number(value[0]))
      } else throw new BadRequestError("Please specify the age to match properly")
    } else if (field == "crops") {
      value = value.split("-");
      if (value.length == 0) return
      let cropArr = [];
      value.forEach(crop => cropArr.push(crop));
      query = `crops && $${count++}`
      parameters.push(cropArr);
    } else if (field != "address") {
      query = `${field} = $${count++}`
      parameters.push(value);
    }
  
    if (query !== "") filtersArray.push(query);
  
  });

  return { fields: fields || "*", 
    filters: filtersArray.length == 0 ? "" : ` WHERE ${filtersArray.join(" AND ")}`,
    parameters
  }
}

