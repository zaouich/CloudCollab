const { Schema, default: mongoose, model } = require("mongoose");
const File = require("./fileModel");

const downloadSchema = new Schema({
    user : {
        type : mongoose.Schema.ObjectId,
        ref : "User"
    },file:{
        type : mongoose.Schema.ObjectId,
        ref : "File"
    }
})

downloadSchema.statics.calc =async function(FileId){
    const statics = await this.aggregate([
        {
            $match:{file:FileId}
        },
        {
            $group:{
                _id:'$file',
                nDownloads : {$sum:1}
            }
        }
    ])
    console.log(statics[0].nDownloads)
   await File.findByIdAndUpdate(FileId,{downloads:statics[0].nDownloads},{new:true})

}

downloadSchema.post("save",function(doc){
    doc.constructor.calc(doc.file)
})

const Download = model("Download",downloadSchema)
module.exports = Download