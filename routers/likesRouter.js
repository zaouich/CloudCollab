const { Router } = require("express");
const { checkLogin } = require("../controllers/authController");
const {getOneLikeForFileId,getAllLikeForFileId,postNewLike,deleteLike}=require("../controllers/likesController")
const router = Router({mergeParams:true})
router.route("/").get(getAllLikeForFileId).post(checkLogin,postNewLike).delete(checkLogin,deleteLike)
router.route("/:likeId").get(getOneLikeForFileId)
module.exports = router