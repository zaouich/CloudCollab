const Comment = require("../models/commentsModel")
const File = require("../models/fileModel")
const AppError = require("../utils/AppError")
const catchAsync = require("../utils/catchAsync")

const checkComment= async(req,res)=>{
    const object_ = await Comment.findOne({user:req.user._id,file:req.params.fileId})
    console.log(object_)
    return object_!=null
}
const postNewComment = catchAsync(async(req,res,next)=>{
    const file =await File.findById(req.params.fileId)
    if(!file) return next(new AppError(400,"fo file with this id"))
    const {text} = req.body
    const comment = await Comment.create({
        text,user:req.user._id,file:req.params.fileId
    })
    res.status(201).json({
        status:"success",
        comment
    })
    next()
})
//  delete comment
const deleteComment = catchAsync(async(req,res,next)=>{
    const file =await File.findById(req.params.fileId)
    if(!file) return next(new AppError(400,"fo file with this id"))
    if(!await checkComment(req,res)) return next(new AppError(400,"you have no comment on this file"))
    const comment = await Comment.findOneAndDelete({user:req.user._id,file:req.params.fileId})
    res.status(200).send("deleted")
    next()
})
module.exports = {postNewComment,deleteComment}