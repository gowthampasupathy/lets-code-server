const mongoose =require('mongoose')
const userschema=new mongoose.Schema({
    name:String,
    email:String,
    password:String,
    role:{
        type:String,
        default:"user"
    }

})
const usermodal=mongoose.model("register",userschema)
module.exports=usermodal;