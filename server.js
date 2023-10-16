const express=require("express");
const app=express();
const fs=require("fs");
const path=require("path");
const cookieparser=require("cookie-parser");
const session=require("express-session");
app.set("view engine","ejs")
app.use(cookieparser());
const client=require("mongodb").MongoClient;
let dbinstance;
client.connect("mongodb://127.0.0.1:27017").then((server)=>{
    dbinstance=server.db("EcommB");
})
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
const productRoutes=require("./routing/productroutes");


app.get("/dashboard.html",(req,res)=>{
    // //res.send("Dashboard");
     res.redirect("/users/dashboard");
   
    
})

app.get("/",(req,res)=>{
// let data=fs.readFileSync("products.json","utf-8");

// //res.json(JSON.parse(data));


//     res.render("index",{products:JSON.parse(data)});

dbinstance.collection("products").find({}).toArray().then((data)=>{
    res.render("index",{products:data});

})
})
app.use(express.static("public"));
app.use(express.urlencoded());
app.use("/products",productRoutes);
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
    //res.sendFile(path.join(__dirname,"./public/login.html"));
res.render("login",{message:""});

})

// app.get("/dashboard",(req,res)=>{
//     if(req.session.username)
//     res.sendFile(path.join(__dirname,"./public/dashboard.html"));
// else
// res.redirect("/login");

// })
app.post("/login",(req,res)=>{
    dbinstance.collection("users").find({$n:[{'username':req.body.username},{'password':req.body.password}]}).toArray().then((data)=>{
        if(data.length==0)
        res.render("login",{message:"Invalid user/password"});
    else
    {
        req.session.username=req.body.username;
 res.render("dashboard",{name:req.session.username});
    }
    });
    //console.log(req.body);
//     fs.readFile("users.txt","utf-8",(err,data)=>{

//         let records=JSON.parse(data);
//         let results=records.filter((item)=>{
//             if(item.username==req.body.username && item.password==req.body.password)
//             return true;
//         })
//         if(results.length==0)
//         //res.send("Invalid user/password");
//     //res.redirect("/login")
//     res.render("login",{message:"Invalid user/password"});
//     else
//     //res.send("Welcome");
// {
//    req.session.username=req.body.username;
// res.render("dashboard",{name:req.session.username});

// }

   
})
//express
//express-session
//cookie-parser

app.get("/productdetails/:data",(req,res)=>{


    // fs.readFile("products.json","utf-8",(err,data)=>{

    //     let products=JSON.parse(data);
    //     let results=products.filter((item)=>{
    //         if(item.id==req.params.data)
    //         return true;
    //     })
    //     res.render("productdetails",{products:results});
        

    // })
    dbinstance.collection("products").find({"id":parseInt(req.params.data)}).toArray().then((data)=>{
        res.render("productdetails",{products:data});
    });
    

})

app.listen(3000,(err)=>{
console.log("Server Started...");

});