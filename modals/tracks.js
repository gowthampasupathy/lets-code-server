const mongoose =require('mongoose')
const exploreschema=new mongoose.Schema({
    title:String,
    description:String,
    imageurl:String,
    type:String,
    check:Boolean,
    url:String,
    count:Number,
    badgecount:Number,
    enrollment:Number

})
const trackmodal=mongoose.model("track",exploreschema)
module.exports=trackmodal;