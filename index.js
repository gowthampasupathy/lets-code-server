const express=require('express')
const mongoose=require('mongoose')
const cors=require('cors')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const cookieParser=require('cookie-parser')
const usermodal=require('./modals/sign')
const trackmodal=require('./modals/tracks')
const prbmodal=require('./modals/problem')


const app=express()
app.use(cors({
    origin:"https://letscode-two.vercel.app",
    methods:["GET","POST","PUT","DELETE"],
    credentials:true
}))
app.use(express.json())
app.use(cookieParser())
const url="mongodb+srv://Gowtham:6374013119@cluster0.ki41eq9.mongodb.net/crud?retryWrites=true&w=majority"
mongoose.connect(url)

//verify  admin
const verifyadmin =(req,res,next)=>{
    const token=req.cookies.token
    if(!token){
        return res.json("Token is missing")
    }else{
        jwt.verify(token,"jwt-secret-key",(err,decoded)=>{
            if(err){
                return res.json("error with the token")
            }else{
                if(decoded.role==="admin"){
                    next();
                }else{
                    return res.json("not admin")
                }
            }
        })
    }
}

app.get("/dashboard",verifyadmin,(req,res)=>{
    res.json("Success")
})
//verify user
const verifyUser =(req,res,next)=>{
    const token=req.cookies.token
    if(!token){
        return res.json("Token is missing")
    }else{
        jwt.verify(token,"jwt-secret-key",(err,decoded)=>{
            if(err){
                return res.json("error with the token")
            }else{
                if(decoded.role==="user"){
                   next();
                }else{
                    return res.json("not user")
                }
            }
        })
    }
}

app.get("/explore",verifyUser,(req,res)=>{
    res.json("Success")
})
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
                    res.cookie("token",token,{ 
                        httpOnly: true, // Ensure cookie is accessible only through HTTP(S)
                        secure: true, // Set secure flag if request is over HTTPS
                        sameSite: 'none' // Enforce strict SameSite policy
                    })
                    console.log(token);
                    return res.json({status:"Success",role:result.role,token:token})

                }else{
                    return res.json("Password Incorrect")
                }
            })
        }
        else{
           return res.json("No Record Exist")
        }
    }
    )
})

//Tracks code

app.get("/trac",(req,res)=>{
    const type="Basic Tracks"
    trackmodal.find({type:type})
    .then(trk=>res.json(trk))
    .catch(err=>res.json(err))
})

//plan
app.get("/plan",(req,res)=>{
    const type="Study Plan"
    trackmodal.find({type:type})
    .then(trk=>res.json(trk))
    .catch(err=>res.json(err))
})
//addtrack

app.post("/addtrack",(req,res)=>{
    trackmodal.create(req.body)
    .then(user=>res.json(user))
    .catch(err=>res.json(err))
})
//category option
app.get("/cat",(req,res)=>{
    trackmodal.find({},{title:1,_id:0})
    .then(trk=>res.json(trk))
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
//prblistpage

app.get("/prb/:title",(req,res)=>{
    title=req.params.title
    trackmodal.find({title:title})
    .then(prb=>res.json(prb))
    .catch(er=>res.json(er))
})
//problem info
app.post("/addproblem",(req,res)=>{
    prbmodal.create(req.body)
    .then((prb)=>res.json(prb))
    .catch((er)=>res.json(er))
})

app.get("/problem/:title",(req,res)=>{
    title=req.params.title
    prbmodal.find({title:title})
    .then((prb)=>res.json(prb))
    .catch((err)=>res.json(err))

})

//getproblem
app.get("/getprb",(req,res)=>{
    prbmodal.find({},)
    .then((prb)=>res.json(prb))
    .catch((er)=>res.json(er))
})

app.get("/getprb/:problemtitle",(req,res)=>{
    title=req.params.problemtitle
    prbmodal.findOne({problemtitle:title})
    .then((prb)=>res.json(prb))
    .catch((er)=>res.json(er))
})

app.listen(3001,()=>{
    console.log("server is Running")
})


