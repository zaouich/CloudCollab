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
                nLikes : {$sum : 1 } 
            }
        }]
    )
        if(stat.length ==0) return await File.findOneAndUpdate({_id:fileId},{likes:0})
        await File.findOneAndUpdate({_id:fileId},{likes:stat[0].nLikes})
}
likesSchema.post("save",async function(doc){
    console.log(doc.file._id,"*******§§§§§§§§§§§!!!")
     doc.constructor.calcul(doc.file._id)
})

likesSchema.post('findOneAndDelete',async function(doc){
    console.log(doc.file)

    if(doc)return await doc.constructor.calcul(doc.file)
})
const Like = model("Like",likesSchema)
module.exports=Like