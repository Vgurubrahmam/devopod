const express =require("express")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const pool=require("./db")
const cors = require('cors');
const app=express()
app.use(express.json())
app.use(cors())

pool.connect()
.then((client)=>{
console.log("database conneted");
client.release()
})
.catch((error)=>{
console.log("database connection error",error);

})
// user Table
app.get("/userTable",async(req,res)=>{
    const schemaOfUserTable=`

    CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    
    )
    `
    try{

       await pool.query(schemaOfUserTable);
       console.log("table created successfully");
       const result = await pool.query('SELECT * FROM users');
       const data = result.rows;
       res.status(200).send({message:'Table user  created successfully',data:data})
    }catch(err){
        console.log("error creating table",err);
        res.status(400).send({message:"Table creation error"})

    }
})
// coustomer table
app.get("/coustomerTable",async(req,res)=>{
    const coustomerData=`
    CREATE TABLE IF NOT EXISTS coustomerData (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

    `
    try{
await pool.query(coustomerData)
const result=await pool.query('SELECT * FROM coustomerData');
const data= result.rows
return res.status(200).json({data:data})

    }catch(err){
        console.log(err.message);
        
        res.status(500).json({error:"server error"})
    }
})


// user register
app.post("/userRegister",async(req,res)=>{
    const {username ,email,password}=req.body
    try{
        const userQuery=`SELECT * FROM users WHERE email=$1 OR username=$2`
        const userResult=await pool.query(userQuery,[email,username])
        if(userResult.rows.length>0){
                return res.status(400).json({
                    error:"username or email already exists"
                    
                })
        }
        const hashedpassword=await bcrypt.hash(password,10)
        const insertUser=`INSERT INTO users(username,email,password)
        VALUES($1,$2,$3) RETURNING *`
        const insertResult=await pool.query(insertUser,[username,email,hashedpassword])
        const newUser=insertResult.rows[0]
        res.status(201).json({message:"user registered successfully",user:{id:newUser.id,email:newUser.email,username:newUser.username}})
    }catch(err){
        console.log(err);
        
        res.status(500).send({error:"server error"})
    }

})

// user login 
app.post("/userLogin",async(req,res)=>{
    const {email,password}=req.body
    
    try{
const userCheck=`SELECT * FROM users WHERE email=$1`
const userResult=await pool.query(userCheck,[email])
if(userResult.rows.length===0){
    return res.status(401).json({error:"user not found"})
}
const user=userResult.rows[0]
const isMatch=await bcrypt.compare(password,user.password)
if(!isMatch){
    return res.status(400).json({error:"Incorrect password"})
}
const token=jwt.sign({id:user.id,username:user.username},"guruNxt",{expiresIn:"1 h"})
 res.status(200).json({message:"Login successful",token})
    }catch(err){
        console.log(err.message);
        
res.status(500).json({error:"server error"})
    }
})

// post coustomerData
app.post("/addLeaddata",async(req,res)=>{
    const {name,email,phone,company}=req.body
    console.log(req.body);
    
    try{
       const addCoustomer= ` INSERT INTO coustomerData(name,email,phone,company) VALUES($1,$2,$3,$4) RETURNING *` 
       const coustomerResult=await pool.query(addCoustomer,[name,email,phone,company])
       const newCoustomer=coustomerResult.rows[0]
       res.status(200).json({message:"coustomer added successfully",coustomer:{id:newCoustomer.id,name:newCoustomer.name,email:newCoustomer.email,phone:newCoustomer.phone,company:newCoustomer.company}})
    }catch(err){
        console.log(err.message);
        
        res.status(500).json({error:"server error"})
    }
})

// get single coustomer
app.get("/getSingleCoustomer/:id",async(req,res)=>{
    console.log("Called getsingle");
    
    try{

        const getuser=`SELECT * FROM coustomerData WHERE id=$1`
        const getuserResult=await pool.query(getuser,[req.params.id])
        if(getuserResult.rows.length===0){
            res.status(404).json({error:"Coustomer not found"})
        }
        const coustomer=getuserResult.rows[0]
        res.status(200).json({message:"coustomer fetch scuccssfully",coustomer:coustomer})
    }catch(err){
        console.log(err.message);
        
        res.status(500).json({err:"server error"})
    }
})
// update coustomer
app.put("/updateCoustomerData/:id",async(req,res)=>{
    console.log("called update");
    
    const {name,email,phone,company}=req.body
    try{
        const updateCoustomer=`UPDATE coustomerData SET name=$1, email=$2,phone=$3,company=$4, updated_at=CURRENT_TIMESTAMP  WHERE id=$5 RETURNING *`
        const getuserResult=await pool.query(updateCoustomer,[name,email,phone,company,req.params.id])
        if(getuserResult.rows.length===0){
            res.status(404).json({error:"Coustomer not found"})
        }
        const coustomer=getuserResult.rows[0]
        res.status(200).json({message:"coustomer updated successfully",coustomer:coustomer})
    }catch(err){
        console.log(err.message);
        
res.status(500).json({error:"server error"})
    }

})
// delete coustomer 
app.delete("/deleteCoustomer/:id",async(req,res)=>{
    console.log("delete ");
    
    try{
        const deleteCoustomerQuery=`DELETE FROM coustomerData WHERE id=$1`
        const deleteQueryResult=await pool.query(deleteCoustomerQuery,[req.params.id])
        if(deleteQueryResult.rows.length===0){
            res.status(200).json({message:"coustomer deleted successfully"})
        }
    }catch(err){
        console.log(err.message);
        res.status(500).json({error:"server error"})
        
    }
})

// search coustomer
app.get("/getSearchCoustomer/:search",async(req,res)=>{
    const {search}=req.params
    try{
        const getSearchCoustomer=`SELECT * FROM coustomerData WHERE name ILIKE $1 OR email ILIKE $1 OR phone ILIKE $1  `
        const searchResult=await pool.query(getSearchCoustomer,[`%${search}%`])
        if(searchResult.rows.length===0){
            res.status(400).json({error:"Coustomer not found"})
        }
        const coustomer=searchResult.rows
        res.status(200).json({message:"coustomer data search success",coustomer:coustomer})
    }catch(err){
        console.log(err.message);
        res.status(500).json({error:"server error",err})
        
    }
})
// filter coustomer by company
// app.get("/filterCustomersByCompany/:company",async(req,res)=>{
//     const {company}=req.params
//     try{
//         const getCompanyCoustomer=`SELECT * FROM coustomerData WHERE company ILIKE $1 `
//         const companyResult=await pool.query(getCompanyCoustomer,[`%${company}%`])
//         if(companyResult.rows.length===0){
//             res.status(400).json({error:"Coustomer not found"})
//         }
//         const coustomer=companyResult.rows
//         res.status(200).json({message:"coustomer data company success",coustomer:coustomer})
//     }catch(err){
//         console.log(err.message);
//         res.status(500).json({error:"server error",details: err.message})
        
//     }
// })
app.listen(process.env.PORT || 3000,()=>{
console.log("server is running at port 3000");

})