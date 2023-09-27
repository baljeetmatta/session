const express=require("express");
const path=require("path");
const router=express.Router();
router.get("/dashboard",(req,res)=>{
    //res.sendFile(path.join(__dirname,"../public/dashboard.html"))
    res.render("dashboard");
})

router.get("/profile",(req,res)=>{
   res.send("User profile page");
})

router.get("/history",(req,res)=>{
    res.send("User history page");
 })
 module.exports=router;
