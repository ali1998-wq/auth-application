const express=require("express");
const { Register, Login, grantAccess, allUsers, singleUser } = require("../controllers/users");
const { adminMiddleWare } = require("../utils/middlewares/adminMiddleware");
const { userMiddleWare } = require("../utils/middlewares/userMiddleware");
const Router=express.Router();

Router.post("/register",Register);
Router.post("/login",Login);
Router.put("/author/access",adminMiddleWare,grantAccess);
Router.get("/user/all",userMiddleWare,allUsers);
Router.get("/user/:id",userMiddleWare,singleUser);

module.exports=Router;