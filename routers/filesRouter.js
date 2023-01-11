const { Router } = require("express");
const { checkLogin } = require("../controllers/authController");
const {getAllFiles,getOneFile,uplaod,uplaodFile,deleteAll,updateFile,downloadFile} = require("../controllers/fileController");
const likesRouter = require("../routers/likesRouter")
const commentsRouter = require("../routers/commentsRouter")
const downloadsRouter = require("../routers/downloadsRouter")
const router = Router()
router.use("/:fileId/likes",likesRouter)
router.use("/:fileId/comments",commentsRouter)
router.use("/:fileId/downloads",downloadsRouter)
router.route("/").get(getAllFiles).post(checkLogin,uplaod, uplaodFile ).delete(deleteAll)

router.route("/:id").get(getOneFile).patch(uplaod,updateFile)

module.exports = router