const mongoose =require('mongoose')
const trackschema=new mongoose.Schema({
    email:String,
    track: {
        title:String,
        description:String,
        imageurl:String,
        type:String,
        check:Boolean,
        url:String,
        count:Number,
        badgecount:Number,
    
    }

})
const usertrackmodal=mongoose.model("usertrack",trackschema)
module.exports=usertrackmodal;