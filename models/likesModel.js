const { Schema, default: mongoose, model } = require("mongoose");
const File = require("./fileModel");

const likesSchema = new Schema({
    user : {
        type: mongoose.Schema.ObjectId,
        ref:'User'
    },file:{
        type : mongoose.Schema.ObjectId,
        ref:"File"
    }
})
likesSchema.index({user:1,file:1},{unique:true})

likesSchema.statics.calcul=async function(fileId){
    const stat =await this.aggregate(
       [ {
            $match : {file:fileId}
        },{
            $group:{
                _id:'$file',
                nLikes : {$sum : 1}  || 0
            }
        }]
    )
    await File.findByIdAndUpdate(fileId,{likes:stat[0].nLikes})
    console.log(stat[0].nLikes)
}
likesSchema.post("save",function(doc){
    doc.constructor.calcul(doc.file)
})
likesSchema.post('findOneAndDelete',function(doc){
    doc.constructor.calcul(doc.file)
})
const Like = model("Like",likesSchema)
module.exports=Like