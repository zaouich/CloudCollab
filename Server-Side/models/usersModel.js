const { Schema, Model, model } = require("mongoose");
const validator = require("validator")
const bcrypt = require("bcrypt");
const crypto = require("crypto")

const userschema = new Schema({
    userName:{
        type :String,
        required: [true,"Why No user Name ?"],
        unique : true
    },
    email:{
        type : String,
        required:[true,"Why No Email ?"],
        unique :true,
        validate:[validator.isEmail,"please provide a correct email !"]
    },password:{
        type:String,
        required:[true,"Why no password"],
    },
    confirmPassword : {
        type : String,
        required:[true,"you should confirm your password"],
        validate:{
            validator:function(value){
                console.log(this.password , value)
                return this.password===value
            },
            message : "passwords not the same"
        }
    },
    changedAt  : {
        type : Date
    },
    active : {
        type:Boolean,
        default : true 
    },
    resetToken  : String,
    exipreResetToken:Date
},{
    toJSON:{virtuals:true},
    toObject : {virtuals:true}
})

userschema.virtual("comments",{
    ref:"Comment",
    foreignField:"user",
    localField:"_id"
})
userschema.virtual("likes_",{
    ref:"Like",
    foreignField:"user",
    localField:"_id"
})
userschema.virtual("downloads",{
    ref:"Download",
    foreignField:"user",
    localField:"_id"
})
userschema.pre(/^find/,function(next){
    this.find({active:true})
    next()
})
userschema.pre("save",async function(next){
    if( ! this.isModified("password")) return next()
    this.password =await bcrypt.hash(this.password,12)
    this.confirmPassword = undefined
})
userschema.pre("save",async function(next){
    if( ! this.isModified("password") || this.isNew) return next()
    this.changedAt = Date.now()
    this.resetToken = undefined
    this.exipreResetToken= undefined
})
// check if the password is true
userschema.methods.isCorrectPassword =async function(condidatPassword,password){
    console.log("*****")
    return await bcrypt.compare(condidatPassword,password)
}
// chekck if the password changed
userschema.methods.isChanged = async function(creationDate){
    if(!this.changedAt) return false 
    return  parseInt(this.changedAt.getTime()/1000) > creationDate
}
// create the reset token
userschema.methods.resetTokenMethod = async function(){
    const reset_token =  crypto.randomBytes(32).toString("hex")
    const crypted_reset_token = crypto.createHash("sha256").update(reset_token).digest("hex")
    this.resetToken = crypted_reset_token
    this.exipreResetToken =new Date(Date.now() +600000) // 10 min
    return reset_token
}
const User =  model("User",userschema)
module.exports = User