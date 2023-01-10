const { Schema, default: mongoose, model } = require("mongoose");
const File = require("./fileModel");

const likesShecma = new Schema({
    user : {
        type: mongoose.Schema.ObjectId,
        ref:'User'
    },file:{
        type : mongoose.Schema.ObjectId,
        ref:"File"
    }
})
likesShecma.statics.calcul=async function(fileId){
    const stat =await this.aggregate(
       [ {
            $match : {file:fileId}
        },{
            $group:{
                _id:'$file',
                nLikes : {$sum : 1}
            }
        }]
    )
    await File.findByIdAndUpdate(fileId,{likes:stat[0].nLikes})
    console.log(stat[0].nLikes)
}
likesShecma.post("save",function(doc){
    doc.constructor.calcul(doc.file)
})
likesShecma.post('findOneAndDelete',function(doc){
    doc.constructor.calcul(doc.file)
})
const Like = model("Like",likesShecma)
module.exports=Like