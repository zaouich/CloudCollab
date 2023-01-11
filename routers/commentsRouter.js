const { Router } = require("express");
const { checkLogin } = require("../controllers/authController");
const { postNewComment,deleteComment } = require("../controllers/commentsController");

const router = Router({mergeParams:true})
router.route("/").post(checkLogin,postNewComment).delete(checkLogin,deleteComment)
module.exports = router