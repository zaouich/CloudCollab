const { Router } = require("express");
const { checkLogin } = require("../controllers/authController");
const downolad = require("../controllers/downloadsController");

const router = Router({mergeParams:true})
router.route("/").get(checkLogin,downolad)
module.exports = router