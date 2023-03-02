const File = require("../models/fileModel")
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/AppError")
const multer = require("multer")
const getAllFiles =async(req,res,next)=>{
    const queryObject = req.query
    var queryObject_ = {...queryObject}
    var others = ["sort","fields","page","limit"]
    others.forEach(el=>{
        delete queryObject_[el]
    })
    // 1 basic filtring
    // 2 advanced filtring
    const queryStr = JSON.stringify(queryObject_).replace(/\b(gte|gt|lt|lte)\b/g,match=>`$${match}`)
    var query = File.find(JSON.parse(queryStr)) // we use this query 
    //3 sorting
    if( queryObject.sort){

        const sortBy =req.query.sort.split(",").join(" ")
         query = query.sort(sortBy)
    }
    else query = query.sort("-downloads,-likes")
    // 4 fileds
    if(queryObject.fields){

        const fields = req.query.fields.split(",").join(" ")
          query = query.select(fields)
    }
    else query = query.select("-__v")

    // 5 pagination
    const page = req.query.page *1 || 1
    const limit = req.query.limit *1 ||10
    const skip = (page -1)*limit
    query=query.skip(skip).limit(limit)

 const files =await query
    res.status(200).json({
        status : "success",
        data : {legth : files.length,files}
    })
}

const getOneFile =catchAsync( async(req,res,next)=>{
    const file = await File.findById(req.params.id).populate({path:""})
    if(!file) return next(new AppError(400,"no file found by this id"))
    res.status(200).json({
        status : "success",
        data : file
    })
})
// upload file
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/files')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, `${req.user._id}-${uniqueSuffix}-${file.originalname}`)
    }
  })
  const fileFilter = (req, file, cb) => {
    if ( file.mimetype.split("/")[1] !== "x-bittorrent") {
        console.log(file.mimetype.split("/")[1])
         cb(new AppError(400, "should only be a torrent file"), false)
    
  }
  else {
    cb(null,true)
  }
  
  }
const uplaod = multer({storage,fileFilter}).single("file")

// update files
const uplaodFile =catchAsync(async(req,res,next)=>{
    const {name,description,categorie}=req.body
    if(req.file) req.body.file  = req.file.filename
    const newFile = await File.create({file:req.body.file,name,description,categorie,uploader:req.user._id})
    res.status(201).json({
        newFile
    })
})
// update files 
const updateFile = catchAsync(async(req,res,next)=>{
    // get the file
    const file = await File.findOne({uploader:req.user._id,_id:req.params.id})
    if(!file) return next(new AppError(400,"no file belong to you"))
    const body_= {...req.body}
    var allowed =[ "name","description","categorie"]
    Object.keys(body_).forEach(el=>{
        if(! allowed.includes(el)) delete body_[el] 
    })
    if(req.file) body_.file=req.file.filename
    const updated_file = await File.findOneAndUpdate({_id:req.params.id},body_,{runValidators:true,new:true}) 
    res.status(201).json({
        status: "success",
        updated_file
    })
})
// delete all files
const deleteAll  = async(req,res,next)=>{
    await File.deleteMany()
}
const downloadFile = (req,res,next)=>{
    var file ='./public/files/node.torrent'
    res.download(file);
}
module.exports = {getAllFiles,getOneFile,uplaod,uplaodFile,deleteAll,updateFile,downloadFile}