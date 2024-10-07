const express=require("express");
const { addRole, allRoles, singleRole, updateRole, deleteRole } = require("../controllers/role");
const Router=express.Router();

Router.post("/role/add",addRole);
Router.get("/role/all",allRoles);
Router.get("/role/:id",singleRole);
Router.put("/role/update",updateRole);
Router.post("/role/delete",deleteRole)

module.exports=Router;