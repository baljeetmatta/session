const express=require("express");
const app=express();
const fs=require("fs");
const path=require("path");
const cookieparser=require("cookie-parser");
const session=require("express-session");
app.use(cookieparser());
const oneday=1000*60*60*24;
const userRoutes=require("./routing/userroutes");

app.use(session({
    saveUninitialized:true,
    resave:false,
    secret:'askjh34asdf345#@#43',
    cookie:{maxAge:oneday}
}));
app.use("/users",auth,userRoutes);
function auth(req,res,next)
{
    if(req.session.username)
     next();
    else
    res.redirect("/");

}
app.get("/dashboard.html",(req,res)=>{
    // //res.send("Dashboard");
     res.redirect("/users/dashboard");
   
    
})
app.use(express.static("public"));
app.use(express.urlencoded());
app.get("/logout",(req,res)=>{
    req.session.destroy();
    res.redirect("/login");

})

app.get("/",(req,res)=>{
    if(req.session.username)
    res.redirect("/users/dashboard");
else
    res.sendFile(path.join(__dirname,"./public/login.html"));
})
app.get("/login",(req,res)=>{
    if(req.session.username)
    res.redirect("/users/dashboard");
else
    res.sendFile(path.join(__dirname,"./public/login.html"));
})

// app.get("/dashboard",(req,res)=>{
//     if(req.session.username)
//     res.sendFile(path.join(__dirname,"./public/dashboard.html"));
// else
// res.redirect("/login");

// })
app.post("/login",(req,res)=>{
    //console.log(req.body);
    fs.readFile("users.txt","utf-8",(err,data)=>{

        let records=JSON.parse(data);
        let results=records.filter((item)=>{
            if(item.username==req.body.username && item.password==req.body.password)
            return true;
        })
        if(results.length==0)
        res.send("Invalid user/password");
    else
    //res.send("Welcome");
{
   req.session.username=req.body.username;
res.redirect("/users/dashboard")
}

    })

})
//express
//express-session
//cookie-parser



app.listen(3000,(err)=>{
console.log("Server Started...");

});