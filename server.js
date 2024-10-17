const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const fs = require('fs').promises


require('dotenv').config()
app.use(cookieParser())
app.use(express.json())



async function Initialize(){

    
    const data = await fs.readFile("Customer.json",'utf-8')
    if(data){
        const parseData = JSON.parse(data)
        db.push(...parseData)
    }
    
}
Initialize()



const db = []

app.post("/signup",async(req,res) =>{
     
    const user =  {"name":req.body.name,"email":req.body.email,"age":req.body.age,"job":req.body.job}
    const token = jwt.sign(user,process.env.ACCESS_TOKEN,{expiresIn:'1hr'})
    db.push(user)
    const compress = JSON.stringify(db,null,3)
    res.cookie("token",token,{
        httpOnly:true
    })

    try{

    await fs.writeFile("Customer.json",compress)
    console.log(db)
    res.send("Your data has been uploaded!")
    }
    catch(err){
        console.error(err)
        res.sendStatus(500).send("There seems to be an error")
    }
    
    
    
})

app.post("/signin",(req,res) =>{

    const checktoken = req.cookies.token

    if(!checktoken){

        res.sendStatus(403).send("Token does not exist. Please sign up first.")
    }

    try{
    const valid_token = jwt.verify(checktoken,process.env.ACCESS_TOKEN)
    const user = db.find(user => user.name === valid_token.name)
    if(user){
        res.json(user)
        console.log(user)
    }
    else{
        res.sendStatus(404).send("Not Found.")
    }
    }

    catch(err){
        console.error(err)
    }
    

    })

    