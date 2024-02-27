const mongoose=require('mongoose')
const probleminfo= new mongoose.Schema({
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
    ]
})

const prbmodal=mongoose.model("problemdoc",probleminfo)
module.exports=prbmodal