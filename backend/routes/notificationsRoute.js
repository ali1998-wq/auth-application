const express=require("express");
const { getNotifications } = require("../controllers/notifications");

const Router=express.Router();

Router.get("/notifications/author/:id",getNotifications);
module.exports=Router;