const { Router } = require("express");
const { checkLogin } = require("../controllers/authController");
const {getAllFiles,getOneFile,uplaod,uplaodFile,deleteAll,updateFile} = require("../controllers/fileController");
const likesRouter = require("../routers/likesRouter")
const router = Router()
router.use("/:fileId/likes",likesRouter)
router.route("/").get(getAllFiles).post(checkLogin,uplaod, uplaodFile ).delete(deleteAll)
router.route("/:id").get(getOneFile).patch(uplaod,updateFile)

module.exports = router