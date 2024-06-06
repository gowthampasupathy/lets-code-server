const express=require('express')
const mongoose=require('mongoose')
const cors=require('cors')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const cookieParser=require('cookie-parser')
const usermodal=require('./modals/sign')
const trackmodal=require('./modals/tracks')
const prbmodal=require('./modals/problem')
const userfulmodal=require('./modals/user')
const usertrackmodal=require('./modals/usertrack')


const app=express()
app.use(cors({
    origin:["https://lets-code-self.vercel.app","http://localhost:3000"],
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
                  return res.json({status:"Success",email:decoded.email,id:decoded.id})
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
//check email
app.post("/getemail",(req,res)=>{
    const user=usermodal.find({email:req.body})
    if(user.size==0){
        res.json("No")
    }else{
        res.json("yes")
    }
})
//Login Code
app.post("/login",(req,res)=>{
    const{email,password}=req.body
    usermodal.findOne({email:email})
    .then((result)=>{
        if(result){
            bcrypt.compare(password,result.password,(err,resp)=>{
                if(resp){
                    const token=jwt.sign({email:result.email,role:result.role,id:result.id},"jwt-secret-key",{expiresIn:'1d'})
                    res.cookie("token",token,{ 
                        httpOnly: true, 
                        secure: true, 
                        sameSite: 'none' 
                    })
                    return res.json({status:"Success",role:result.role,token:token})

                }else{
                    return res.json("Password Incorrect")
                }
            })
        }
        else{
           return res.json("No Such Email Exist")
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
//general
app.get("/track",(req,res)=>{
    trackmodal.find({})
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
// async function main(){
// const user=userfulmodal.find({name:"ut6f75p"});
// console.log(user);   
// }
// main();
// //populate
// app.get('/pop',(req,res)=>{
//     userfulmodal.find({name:"ut6f75p"}).populate('track').exec(function(arr,usr){
//         if(err){
//             res.json("Error");
//         }
//         else{
//             res.json(usr);
//         }
//     })
// })

app.get("/pop",(req,res)=>{
    usertrackmodal.find({}).populate('track')
    .then(trk=>res.json(trk))
    .catch(er=>res.json(er))
})
//addtrack
app.post("/addtrack",async(req,res)=>{
    // trackmodal.create(req.body)
    // .then(user=>res.json(user))
    // .catch(err=>res.json(err))
    try{
        trackmodal.create(req.body)
        const user= await userfulmodal.find({})
        if (user.length==0) {
            return res.status(404).json({ error: "there is no user" });
        }
        for(let users of user){
           users.track.push(req.body)
           await users.save();
        }
        res.json("saved successfullly")
    }catch(error){
        res.status(500).json({ error: 'Internal server error' });
    }
})
//delete track
app.delete("/deletetrack/:id",async(req,res)=>{
    const id=req.params.id;
    await trackmodal.findByIdAndDelete(id);
    const users = await userfulmodal.find({});
    if (users.length === 0) {
        return res.status(404).json({ error: "No users found with this track" });
    }
    for (let user of users) {
        const index = user.track.findIndex(trk => trk.id == id);
        user.track.splice(index, 1);
        await user.save();
    }
    res.json("Deleted Succcessfully")
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
app.post("/addproblem",async(req,res)=>{
    try{
        prbmodal.create(req.body)
        const user= await userfulmodal.find({})
        if (user.length==0) {
            return res.status(404).json({ error: "there is no user" });
        }
        for(let users of user){
           users.problem.push(req.body)
           await users.save();
        }
        res.json("saved successfullly")
    }catch(error){
        res.status(500).json({ error: 'Internal server error' });
    }
})
//delete problem

app.delete("/deleteproblem/:id",async(req,res)=>{
    const id=req.params.id;
    await prbmodal.findByIdAndDelete(id);
    const users = await userfulmodal.find({});
    if (users.length === 0) {
        return res.status(404).json({ error: "No users found with this track" });
    }
    for (let user of users) {
        const index = user.problem.findIndex(prb => prb.id == id);
        user.track.splice(index, 1);
        await user.save();
    }
    res.json("Deleted Succcessfully")
})

app.get("/problem/:title",(req,res)=>{
    title=req.params.title
    prbmodal.find({title:title})
    .then((prb)=>res.json(prb))
    .catch((err)=>res.json(err))

})

//getproblem
app.get("/getprb",(req,res)=>{
    prbmodal.find({})
    .then((prb)=>res.json(prb))
    .catch((er)=>res.json(er))
})

app.get("/getprb/:problemtitle",(req,res)=>{
    title=req.params.problemtitle
    prbmodal.findOne({problemtitle:title})
    .then((prb)=>res.json(prb))
    .catch((er)=>res.json(er))
})

//user management

app.post("/user",(req,res)=>{
    userfulmodal.create(req.body)
    .then((re)=>res.json(re))
    .catch((er)=>res.json(er))
})
//usertrack management
app.post("/type", async (req, res) => {
    try {
        // Manually construct the document
        const newUserTrack = new usertrackmodal({
            email: req.body.email,
            track: req.body.track
        });

        // Save the document to the database
        const savedDocument = await newUserTrack.save();

        // Send the created document as JSON response
        res.json(savedDocument);
    } catch (error) {
        // Send error as JSON response
        res.status(500).json({ error: error.message });
    }
});
app.get("/gettrack",(req,res)=>{
    usertrackmodal.find({})
    .then((trk)=>res.json(trk))
    .catch((er)=>res.json(er))
})
app.get("/info/:id",(req,res)=>{
    id=req.params.id
    userfulmodal.findById({_id:id})
    .then((re)=>res.json(re))
    .catch((er)=>res.json(er))
})
app.get("/find",(req,rea)=>{
    usertrackmodal.find()
    .then((pp)=>res.json(pp))
    .catch((er)=>res.json(er))
})
app.get("/getinfo/:email",(req,res)=>{
    const email=req.params.email
    userfulmodal.find({email:email})
    .then((out)=>res.json(out))
    .catch((er)=>res.json(er))
})
//get the problem detail by id
app.get("/getprbdetail/:id/:pid",async(req,res)=>{
    const id = req.params.id;
    const pid=req.params.pid;
    try {
        // Find the user by ID
        const user = await userfulmodal.findById(id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Extract the test cases from the user document
        const problemarr = user.problem.find(problem => problem.problemtitle==pid);

        res.json(problemarr);
    } catch (error) {
        console.error('Error retrieving test cases:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

})
app.get("/getprbtestcase/:id/:pid",async (req,res)=>{
    const id = req.params.id;
    const pid=req.params.pid;
    try {
        // Find the user by ID
        const user = await userfulmodal.findById(id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Extract the test cases from the user document
        const problemarr = user.problem.find(problem => problem.problemtitle==pid);
        const testCases=problemarr.testcase;

        res.json(testCases);
    } catch (error) {
        console.error('Error retrieving test cases:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

})

//get problem hidden testcase
app.get("/getprbhiddentestcase/:id/:pid",async (req,res)=>{
    const id = req.params.id;
    const pid=req.params.pid;
    try {
        // Find the user by ID
        const user = await userfulmodal.findById(id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Extract the test cases from the user document
        const problemarr = user.problem.find(problem => problem.problemtitle==pid);
        const hiddentestCases=problemarr.hiddentestcase;

        res.json(hiddentestCases);
    } catch (error) {
        console.error('Error retrieving test cases:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

})

//get solution 
app.get("/getsolution/:id/:pid",async (req,res)=>{
    const id = req.params.id;
    const pid=req.params.pid;
    try {
        // Find the user by ID
        const user = await userfulmodal.findById(id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Extract the test cases from the user document
        const index=0;
        const problemarr = user.problem.find(problem => problem.problemtitle==pid);
        const solution=problemarr.solutions[index];

        res.json(solution);
    } catch (error) {
        console.error('Error retrieving test cases:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

})

//solution updation into the user profile problem array
app.put("/updatesolution/:id/:prbid", async(req, res) => {
    const id = req.params.id;
    const prbid = req.params.prbid;
    const newSolutions=req.body.submitdetails
    const complete=req.body.complete

    try {
        const user = await userfulmodal.findById(id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const problemIndex = user.problem.findIndex(problem => problem.problemtitle === prbid);
        if (problemIndex === -1) {
            return res.status(404).json({ error: 'Problem not found for this user' });
        }
        user.problem[problemIndex].solutions = newSolutions;
        user.problem[problemIndex].completion = complete;
        if(user.problem[problemIndex].diff=="Easy"){
            user.easy=user.easy+1;
            user.total=user.total+1;
        }else if(user.problem[problemIndex].diff=="Medium"){
            user.medium=user.medium+1;
            user.total=user.total+1;

        }else{
            user.hard=user.medium+1;
            user.total=user.total+1;
        }
        await user.save();
        res.json("updatedsuccessfully");
        console.log("success")
    } catch (error) {
        console.error('Error retrieving test cases:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
//track enrollment updation
app.put("/trackenrollment/:id/:title",async(req,res)=>{
    const id=req.params.id
    const title=req.params.title
    try{
        const user= await userfulmodal.findById(id)

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const trackindex=user.track.findIndex(trk=>trk.title==title)
        user.track[trackindex].enrollment=req.body.enroll
        await user.save();
       



    }catch(error){
        console.log(error)
    }
})
//getenrolledtrack
app.get("/getenrolledtrack/:id",async(req,res)=>{
    const id=req.params.id;
    try{
        const user= await userfulmodal.findById(id)
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
         const enrolled=user.track.filter(trk=>trk.enrollment==1)
        res.json(enrolled)
         

    } catch (error) {
        //console.error('Error retrieving test cases:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

//getgeneral problem
app.get("/getgeneralprblm/:id",async(req,res)=>{
    const id=req.params.id;
    try{
        const user= await userfulmodal.findById(id)
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
         const enrolled=user.problem.filter(prb=>prb.title=="general")
        res.json(enrolled)
         

    } catch (error) {
        //console.error('Error retrieving test cases:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})


// update userinfo
app.put("/updateuserinfo/:id/:oldid",async(req,res)=>{
    const id=req.params.id
    const oldid=req.params.oldid
    const name=req.body.name
    const email=req.body.email
    const contact=req.body.contact
    const college=req.body.college
    const country=req.body.country
    try{
        const user= await userfulmodal.findById(id)
        const user2=await usermodal.findById(oldid)
        if(!user){
            return res.status(404).json({ error: 'User not found' });
        }
        if(!user2){
            return res.status(404).json({ error: 'User not found' });
        }
        user.name=name;
        user.email=email;
        user.contact=contact
        user.college=college
        user.country=country
        await user.save();
        user2.name = name;
        user2.email = email;
        await user2.save();
        res.json("success")
        console.log("succcess")
    }catch(error){
        res.status(500).json({ error: 'Internal server error' });
    }
})
//get registerid
app.get("/getuserid/:oldemail",async(req,res)=>{
    const oldemail=req.params.oldemail
    try{
        const user= await usermodal.find({email:oldemail})
        if(!user){
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json(user)


    }catch(error){
        res.status(500).json({ error: 'Internal server error' });
    }
})

// update userinfo
app.put("/updateregisterinfo/:oldid",async(req,res)=>{
    const oldid=req.params.oldid
    const email=req.body.email
    const name=req.body.name
    try{
        const user= await usermodal.findById(oldid)
        if(!user){
            return res.status(404).json({ error: 'User not found' });
        }
        user.name = name;
        user.email = email;
        await user.save();
        console.log("register success");
        return res.json({ message: "Success" });
        


    }catch(error){
        res.status(500).json({ error: 'Internal server error' });
    }
})
//Password Reset
app.put("/resetpasseord/:oldid",async(req,res)=>{
    const oldid=req.params.oldid
    const newpassword=req.body.password
    bcrypt.hash(newpassword,10)
    .then(async(hash)=>{
        try{
            const user= await usermodal.findById(oldid)
            if(!user){
                return res.status(404).json({ error: 'User not found' });
            }
            user.password=hash;
            await user.save();
            console.log("password set success");
            return res.json({ message: "Password change Success" });
            
    
    
        }catch(error){
            res.status(500).json({ error: 'Internal server error' });
        }
    })
    
})
//get count for adminPage
app.get("/getusercount",async(req,res)=>{
    const user=await userfulmodal.find({})
    res.json(user.length)
})
app.get("/getproblemcount",async(req,res)=>{
    const user=await prbmodal.find({})
    res.json(user.length)
})
app.get("/gettrackcount",async(req,res)=>{
    const user=await trackmodal.find({})
    res.json(user.length)
})

app.listen(3001,()=>{
    console.log("server is Running")
})


