const mongoose= require('mongoose')
const studyplanschema= new mongoose.Schema({
    title:String,
    description:String,
    type:String,
})