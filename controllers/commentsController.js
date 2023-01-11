const Comment = require("../models/commentsModel")
const AppError = require("../utils/AppError")
const catchAsync = require("../utils/catchAsync")

const postNewComment = catchAsync(async(req,res,next)=>{
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
    const comment = await Comment.findOneAndDelete({user:req.user._id,file:req.params.fileId})
    res.status(200).send("deleted")
    next()
})
module.exports = {postNewComment,deleteComment}