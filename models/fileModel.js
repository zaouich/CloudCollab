const {Schema, model} = require("mongoose")
const FileSchema = new Schema({
    file:{
        type : String,
        required:[true,"Why no file"]
    },
    name:{
        type  : String,
        required : [true,"Why no Name ?"]
    },
    description:{
        type : String,
        required : [true,"Why no Name ?"]
    },
    categorie:{
        type : String,
        required : [true,"Why no categorie ?"],
        enum:{
            values : ["movies","television","games","music","application","anime","documentaries","other"],
            message:["invalid categorie"]
        }
    },createdAt:{
        type : Date,
        default:new Date(Date.now())
    },downloads : {
        type:Number,
        default:0
    },likes : {
        type : Number,
        default:0,
    }
    ,uploader:{
        type: String,
        default:"zaouich"
    },active:{
        type:Boolean,
        default : true
    }

})
FileSchema.pre(/^find/,function(next){
    this.find({active:true})
    next()
})
const File = model("File",FileSchema)
module.exports = File