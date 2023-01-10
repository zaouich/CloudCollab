const { Schema, Model, model } = require("mongoose");
const validator = require("validator")
const bcrypt = require("bcrypt");


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
    resetToken  : String
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
const User =  model("User",userschema)
module.exports = User