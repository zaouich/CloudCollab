const {mongoose,Schema, model} = require("mongoose");
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
        required : [true,"Why no description ?"]
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
    },nComment:{
        type : Number,
        default:0,
    }
    ,uploader:{
        type: mongoose.Schema.ObjectId,
        ref:"User"
    },active:{
        type:Boolean,
        default : true
    }

},{
    toJSON:{virtuals:true},
    toObject : {virtuals:true}
})
FileSchema.virtual("comments",{
    ref:"Comment",
    foreignField:"file",
    localField:"_id"
})
FileSchema.pre(/^find/, function(next) {
    this.find({ active: true }).populate("uploader",'userName -_id ').populate("comments",'user text createdAt -_id -file')
    next()
  });

const File = model("File",FileSchema)
module.exports = File