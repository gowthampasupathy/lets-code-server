const mongoose =require('mongoose')
const exploreschema=new mongoose.Schema({
    title:String,
    description:String,
    imageurl:String,
    type:String,
    

})
const trackmodal=mongoose.model("track",exploreschema)
module.exports=trackmodal;