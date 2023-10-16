const express = require("express");
const router = express.Router();
const client = require("mongodb").MongoClient;
const ObjectId=require("mongodb").ObjectId;
let dbinstance;
client.connect("mongodb://127.0.0.1:27017").then((server) => {
    dbinstance = server.db("EcommB");
})
router.get("/", (req, res) => {
    dbinstance.collection("products").find({}).toArray().then((data) => {
        res.render("products/ShowAll", { data: data });

    })


})
router.get("/:id", (req, res) => {
    dbinstance.collection("products").find({'_id':new ObjectId(req.params.id)}).toArray().then((data) => {
       // console.log(data);

        res.render("products/Show", { data: data });
            res.end();

    })


})

router.get("/add", (req, res) => {

    res.render("products/Create");

})

router.post("/add", (req, res) => {

    let obj = {};
    obj.name = req.body.name;
    obj.price = req.body.price;
    obj.description = req.body.description;
    dbinstance.collection("products").insertOne(obj).then((data) => {
        res.redirect("/products");

    })




});
module.exports = router;