const Download = require("../models/downloadsModel")
const File = require("../models/fileModel")

const downolad = async(req,res,next)=>{
    await Download.create({
        file:req.params.fileId,
        user:req.user._id
    })
    const file = await File.findById(req.params.fileId)
    const directory = `./public/files/${file.file}`
    res.download(directory)
}
module.exports = downolad