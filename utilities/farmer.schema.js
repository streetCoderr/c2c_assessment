const zod = require("zod");

const Farmer = zod.object({
  first_name: zod.string({
    required_error: "Please provide your first name",
    invalid_type_error: "Your first name should only contain letters of the alphabet",
  }),
  last_name: zod.string({
    required_error: "Please provide your last name",
    invalid_type_error: "Your last name should only contain letters of the alphabet",
  }),
  phone_number: zod.string({
    required_error: "Please provide your phone number",
    invalid_type_error: "Please provide a valid string of your phone number",
  }),
  age: zod.coerce.number({
    required_error: "Please provide your age",
    invalid_type_error: "Your age should be an integer",
  }).int(),
  address: zod.string({
    required_error: "Please provide your address",
    invalid_type_error: "Your address should be a string",
  }),
  crops: zod.string().array({
    required_error: "Please provide the crops you farm in an array",
    invalid_type_error: "Seems like you did not properly provide an array of your crops",
  })
}).required()

module.exports = Farmer;