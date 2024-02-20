const express=require('express')
const mongoose=require('mongoose')
const cors=require('cors')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const cookieParser=require('cookie-parser')
const usermodal=require('./modals/sign')
const trackmodal=require('./modals/tracks')


const app=express()
app.use(cors({
    origin:"https://letscode-two.vercel.app",
    methods:["GET","POST"],
    credentials:true
}))
app.use(express.json())
app.use(cookieParser())
const url="mongodb+srv://Gowtham:6374013119@cluster0.ki41eq9.mongodb.net/crud?retryWrites=true&w=majority"
mongoose.connect(url)

//verify  admin
// const verifyadmin =(req,res,next)=>{
//     const token=req.cookies.token
//     if(!token){
//         return res.json("Token is missing")
//     }else{
//         jwt.verify(token,"jwt-secret-key",(err,decoded)=>{
//             if(err){
//                 return res.json("error with the token")
//             }else{
//                 if(decoded.role==="admin"){
//                     return res.json("admin")
//                 }else{
//                     return res.json("not admin")
//                 }
//             }
//         })
//     }
// }

// app.get("/dashboard",verifyadmin,(req,res)=>{
//     res.json("Success")
// })
// //verify user
// const verifyUser =(req,res,next)=>{
//     const token=req.cookies.token
//     if(!token){
//         return res.json("Token is missing")
//     }else{
//         jwt.verify(token,"jwt-secret-key",(err,decoded)=>{
//             if(err){
//                 return res.json("error with the token")
//             }else{
//                 if(decoded.role==="user"){
//                     return res.json(" user")
//                 }else{
//                     return res.json("not user")
//                 }
//             }
//         })
//     }
// }

// app.get("/explore",verifyUser,(req,res)=>{
//     res.json("Success")
// })
//SignUp Code
app.post("/register",(req,res)=>{

    const{name,email,password}=req.body
    bcrypt.hash(password,10)
    .then(hash=>{
        usermodal.create({name,email,password:hash})
        .then(user=>res.json("Account Created"))
        .catch(err=>res.json(err))
    })
    .catch(err=>res.json(err))
    
})
//Login Code
app.post("/login",(req,res)=>{
    const{email,password}=req.body
    usermodal.findOne({email:email})
    .then((result)=>{
        if(result){
            bcrypt.compare(password,result.password,(err,resp)=>{
                if(resp){
                    const token=jwt.sign({email:result.email,role:result.role},"jwt-secret-key",{expiresIn:'1d'})
                    res.cookie('token',token)
                    return res.json({status:"Success",role:result.role})

                }else{
                    return res.json("Password Incorrect")
                }
            })
        }else{
           return res.json("No Record Exist")
        }
    }
    )
})

//Tracks code

app.get("/trac",(req,res)=>{
    trackmodal.find({})
    .then(trk=>res.json(trk))
    .catch(err=>res.json(err))
})
//addtrack

app.post("/addtrack",(req,res)=>{
    trackmodal.create(req.body)
    .then(user=>res.json(user))
    .catch(err=>res.json(err))
})


//all post code
// app.post("/tracks",(req,res)=>{
//     trackmodal.create(req.body)
//     .then(user=>res.json(user))
//     .catch(err=>res.json(err))
// })

//getUser
app.get("/user",(req,res)=>{
    usermodal.find({})
    .then((user)=>res.json(user))
    .catch((err)=>res.json(err))
})
app.listen(3001,()=>{
    console.log("server is Running")
})

