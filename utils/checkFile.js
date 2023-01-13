const checkObject= async(Object,req)=>{
    const object_ = await Object.findOne({user:req.user._id,file:req.params.fileId})
    console.log(object_)
    return object_!=null
}
module.exports = checkObject