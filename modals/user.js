const mongoose =require('mongoose')
const trackmodal = require('./tracks')
const userschema=new mongoose.Schema({
    name:String,
    email:String,
    country:String,
    college:String,
    contact:String,
    solvedcount:{
        total:Number,
        easy:Number,
        medium:Number,
        hard:Number,
    },
    problem:[{
        status:Boolean,
        title:String,
        problemtitle:String,
        description:String,
        sampleinput:String,
        sampleoutput:String,
        explanation:String,
        diff:String,
        con:String,
        lvl:String,
        testcase:[
            {
                input:String,
                output:String,
            }
        ],
        solved:[
            {
            prbtitle:String,
            language:String,
            code:String,
            output:String,
            time:String,
            space:String,
    
        }
        ]
        },],
    
})
const userfulmodal=mongoose.model("user",userschema)
module.exports=userfulmodal;