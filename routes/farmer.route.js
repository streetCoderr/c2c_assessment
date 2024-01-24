const router = require("express").Router();
const { insertFarmer, getFarmers } = require("../controllers/farmer.controller");
router.route("/").post(insertFarmer).get(getFarmers);

module.exports = router;