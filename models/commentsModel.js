const { Schema, default: mongoose, model } = require("mongoose");
const File = require("./fileModel");

const CommentsSchema = new Schema({
    text : {
        type :String,
        required:[true,"Why No Text ?"]
    },
    user:{
        type : mongoose.Schema.ObjectId,
        ref:"User",
    },file:{
        type : mongoose.Schema.ObjectId,
        ref : "File"
    },createdAt : {
        type : Date,
        default : Date.now()
    }
})

CommentsSchema.index({user:1,file:1},{unique:true})

CommentsSchema.statics.calc =async function(fileId){
    const commentsStatics =await this.aggregate([
        {
            $match:{file:fileId}
        },
        {
            $group:{
                _id:"$file",
                nComments : {$sum:1 } 
            } }
    ])
    console.log(commentsStatics)
    if(commentsStatics.length==0) return await File.findByIdAndUpdate(fileId,{nComment: 0 } ,{new:false})
    await File.findByIdAndUpdate(fileId,{nComment:commentsStatics[0].nComments } ,{new:false})
}
CommentsSchema.pre(/^find/,function(next){
    this.populate("user","userName")
    next()
})
CommentsSchema.post("save",function(doc){
    doc.constructor.calc(doc.file)
})
CommentsSchema.post("findOneAndDelete",function(doc){
    if(doc)return doc.constructor.calc(doc.file)
})

const Comment = model("Comment",CommentsSchema)
module.exports = Comment