const express=require('express')
const cors=require('cors')
const mysql=require('mysql2')
const bcrypt=require('bcrypt')
const e = require('express')
const app=express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}));

const db=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"Saichowdary@123",
    database:"logindata"
})
db.connect((error)=>{
    if(error){
        console.log(error)
        return
    }
    console.log("database connected succesfully")
})

app.get('/',(req,res)=>{
    console.log(req);
    res.send('Your request is recieved');
})
app.post('/home',async (req,res)=>{
    
    const{username,email,password}=req.body
    
        const hashedpassword=await bcrypt.hash(password,10);
        console.log("user data:",{
            username,
            email,
            password,
            hashedpassword
        })
        // try{
        db.query(`insert into  logintable (user_name,email,passwords) values('${username}','${email}','${hashedpassword}')`,(err,result)=>{
             if(err){
            console.log(err)
            return res.status(409).json({message:"Username or Email already exist"})
        }
        // }catch(err){
        //     return res.status(409).json({message:"Username already exist"})
        // }
        else{
            res.status(200).json({message:"Registration Succesful"})
            console.log("okay")
        }
        })
         
})

app.post('/login',async (req,res)=>{
    console.log(req.body)
    const {username,password}=req.body; 
    let passcode='';
    db.query(`select passwords from logintable where user_name='${username}' `, async (err,result)=>{
         if(err){
            console.log(err)
        }
        if(result.length === 0){
            return res.status(500).json({message:"username not found"})
        }
        console.log(result);
        passcode=result[0]. passwords;
        const ismatch= await bcrypt.compare(password,passcode);
        console.log("password matched",ismatch)
        console.log(ismatch)
        if(ismatch){
                res.status(200).json({message:"Login succesfull"})
            return
        }
        else{
            res.status(500).json({message:"Invalid password"})
            return
        }
    })
    // console.log("data",username,password)
})
app.listen(4000,(req,res)=>{
    console.log("Your server is runninng at port 4000");
})
//  if(err){
//                 console.log("error",err)
//                 if(err.code==='ER_DUP_ENTRY'||err.code==='ERR_HTTP_HEADERS_SENT' ){
//                     return res.status(400).json({message:"User or Email already exist"})
//                 }
//                 return res.status(500).json({message:"database error occured"})
//              }