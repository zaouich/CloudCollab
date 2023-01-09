const { Router } = require("express");
const {getAllFiles,getOneFile,uplaod,uplaodFile,deleteAll,updateFile} = require("../controllers/fileController");

const router = Router()
router.route("/").get(getAllFiles).post(uplaod, uplaodFile ).delete(deleteAll)
router.route("/:id").get(getOneFile).patch(uplaod,updateFile)

module.exports = router