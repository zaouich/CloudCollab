const User = require("../models/usersModel")
const AppError = require("../utils/AppError")
const jwt = require("jsonwebtoken")
const catchAsync = require("../utils/catchAsync")
// admin 
const getAllUsers = catchAsync(async(req,res,next)=>{
    const users = await User.find()
    res.status(200).json({
        status  : "success",
        data : {
            legth : users.length,
            users
        }
    })
})
const getOneUser = catchAsync(async(req,res,next)=>{
    const user = await User.findById(req.params.id)
    if(!user) return next(new AppError(300,"no user found by this id "))
    res.status(200).json({
        status : "success",
        user
    })
})
// user
// get the passport 
const PassPort =async (user,res)=>{
     const token = jwt.sign({id:user._id},process.env.JWT,{expiresIn:process.env.JWTEXPIRESDELAI})
     res.status(200).json({
        status:"success",
        user,
        token
    })
}
// sign up
const signUp  =catchAsync( async(req,res,next)=>{
    const {userName,email,password,confirmPassword}= req.body

    const newUser = await User.create({userName,email,password,confirmPassword})
    console.log(newUser)
    res.status(201).json({
        status : "success",
        newUser
    })
})
// login 
const login = catchAsync(async(req,res,next)=>{
    // check if the user enter the password and the email
    const {email,password} = req.body
    if(!email || !password) return next(new AppError(401,"please enter your email and your password"))
    // check if the email and the password are true
    const user = await User.findOne({email}).select("+ password")
    if(!user ||! await  user.isCorrectPassword(password,user.password)) return next(new AppError(401,"incorrect email or password"))
    // give the passport
    PassPort(user,res)
}   
)
// update password
const updatePassword = catchAsync(async(req,res,next)=>{
    const user = await User.findOne({_id:req.user._id})

    const {oldPassword,password,confirmPassword} = req.body
     // check  the old password 
    if(!oldPassword) return next(new AppError(401,"please provide your old password"))
    if(!await user.isCorrectPassword(oldPassword,user.password)) return next(new AppError(401,"the old password is not true"))
    // check new password
    if(!password ||!confirmPassword) return next(new AppError(401,"please enter you password and confirm it"))
   
    user.password = password
    user.confirmPassword = confirmPassword
    user.changedAt = Date.now()
    await user.save()
    PassPort(user,res)
})
// update me 
const updateMe = async(req,res,next)=>{
    const body_= {...req.body}
    var allowed =["userName","email"]
    Object.keys(body_).forEach(el=>{
        if(! allowed.includes(el)) delete body_[el] 
    })
    const user = await User.findByIdAndUpdate(req.user._id,body_,{runValidators:true,new:true})
    res.status(401).json({
        status : "success",
        user
    })
}
// delete me 
 const deleteMe = catchAsync(async(req,res,next)=>{
    const user = await User.findOne({_id:req.user._id})
     // check  the  password 
     if(!req.body.password) return next(new AppError(401,"please provide your  password"))
     if(!await user.isCorrectPassword(req.body.password,user.password)) return next(new AppError(401,"the  password is not true"))
     user.active = false
     await user.save()
     res.status(200).send("the account has been deleted please contact us for more infos")
 })
module.exports = {getAllUsers,getOneUser,signUp,login,updatePassword,updateMe,deleteMe}