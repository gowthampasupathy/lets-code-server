const mongoose =require('mongoose')
const trackmodal = require('./tracks')

const usertrk =new mongoose.Schema({
    title: String,
    description: String,
    imageurl: String,
    type: String,
    check: Boolean,
    url: String,
    count: Number,
    badgecount: Number,
    enrollment:Number,
});
const userschema=new mongoose.Schema({
    name:String,
    email:String,
    country:String,
    college:String,
    contact:String,
    total:Number,
    easy:Number,
    medium:Number,
    hard:Number,
    
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
        language:String,
        completion:Number,
        solutions:[
            {
                title:String,
                status:String,
                code:String,
                expectedoutput:String,
                output:String,
                langused:String,
                timecomp:String,
                spacecomp:Number,
            }

        ],
        testcase:[
            {
                input:String,
                output:String,
            }
        ],
        hiddentestcase:[
            {
                input:String,
                output:String,
            }
        ],
        },
        
    ],
    track: [usertrk], 
    
})
const userfulmodal=mongoose.model("user",userschema)
module.exports=userfulmodal;