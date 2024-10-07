const express=require("express");
const { addContent, allContent, singleContent, updateContent, deleteContent, contentByAuthor } = require("../controllers/content");
const { authorMiddleWare } = require("../utils/middlewares/authorMiddleware");
const { userMiddleWare } = require("../utils/middlewares/userMiddleware");

const Router=express.Router();

Router.post("/content/add",authorMiddleWare,addContent);
Router.get("/content/all",userMiddleWare,allContent);
Router.get("/content/:id",userMiddleWare,singleContent);
Router.put("/content/update",authorMiddleWare,updateContent);
Router.post("/content/delete",authorMiddleWare,deleteContent);
Router.get("/content/author/:author",authorMiddleWare,contentByAuthor);

module.exports=Router;