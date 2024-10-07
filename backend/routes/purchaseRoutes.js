const express=require("express");
const { mixedMiddleWare } = require("../utils/middlewares/mixMiddleware");
const { userMiddleWare } = require("../utils/middlewares/userMiddleware");
const { makePayment, purchasesByUser, purchasesByAuthor } = require("../controllers/purchses");
const { authorMiddleWare } = require("../utils/middlewares/authorMiddleware");

const Router=express.Router();

Router.post("/payment",userMiddleWare,makePayment);
Router.get("/purchase/user/:id",userMiddleWare,purchasesByUser);
Router.get("/purchase/author/:id",authorMiddleWare,purchasesByAuthor);



module.exports=Router;