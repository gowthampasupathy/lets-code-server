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
})

const prbmodal=mongoose.model("problemdoc",probleminfo)
module.exports=prbmodal