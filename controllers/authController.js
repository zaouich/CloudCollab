const AppError = require("../utils/AppError")
const jwt = require("jsonwebtoken")
const User = require("../models/usersModel")
const catchAsync = require("../utils/catchAsync")

const checkLogin = catchAsync(async(req,res,next)=>{
    // check if there is a token
    if(!req.headers.authorization || ! req.headers.authorization.startsWith("Bearer"))return next(new AppError(401,"please log in first"))
    // get the token
    const token = req.headers.authorization.split(" ")[1]
    //check if the token if true
    const verified = jwt.verify(token,process.env.JWT)// rising an error
    //check if user still exicts
    const user = await User.findById(verified.id)
    if(!user) next(new AppError(401,"this user no more exicts"))
    // check if the user doesnt change his password after a given jwt
    if(await user.isChanged(verified.iat) )  return next(new AppError(401,"the user has been changed his password"))
    req.user = user
    next()
})
module.exports = {checkLogin}