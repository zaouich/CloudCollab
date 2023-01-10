const { Router } = require("express");
const { checkLogin } = require("../controllers/authController");
const { getAllUsers,signUp,login,updatePassword,updateMe,deleteMe } = require("../controllers/userController");

const router = Router()
router.route("/").get(getAllUsers)
router.route("/signUp").post(signUp)
router.route("/login").post(login)
router.route("/updatePassword").patch(checkLogin,updatePassword)
router.route("/updateMe").patch(checkLogin,updateMe)
router.route("/deleteMe").patch(checkLogin,deleteMe)
module.exports = router