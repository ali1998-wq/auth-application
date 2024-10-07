const express=require("express");
const { mixedMiddleWare } = require("../utils/middlewares/mixMiddleware");
const { addPermission, permissionByContent, updatePermission, deletePermission } = require("../controllers/permissions");
const { userMiddleWare } = require("../utils/middlewares/userMiddleware");

const Router=express.Router();

Router.post("/permission/add",mixedMiddleWare,addPermission);
Router.get("/permission/:content",userMiddleWare,permissionByContent);
Router.put("/permission/update",mixedMiddleWare,updatePermission);
Router.post("/permission/delete",mixedMiddleWare,deletePermission);


module.exports=Router;