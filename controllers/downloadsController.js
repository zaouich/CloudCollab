const Download = require("../models/downloadsModel")
const File = require("../models/fileModel")
const AppError = require("../utils/AppError")

const downolad = async(req,res,next)=>{
    const file = await File.findById(req.params.fileId)
    if(!file) return next(new AppError(400,"no file to be downloaded"))
    await Download.create({
        file:req.params.fileId,
        user:req.user._id
    })
    const directory = `./public/files/${file.file}`
    res.download(directory)
}
module.exports = downolad