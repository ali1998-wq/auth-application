var express = require("express");
var rootRouter = express.Router();
const userRouter = require("./userRoutes");
const roleRouter=require('./roleRoutes');
const contentRouter=require('./contentRoutes');
const permissionRouter=require('./permissionsRoutes');
const purchaseRouter=require('./purchaseRoutes');
const notificationRouter=require('./notificationsRoute');

rootRouter.use(userRouter);
rootRouter.use(roleRouter);
rootRouter.use(contentRouter);
rootRouter.use(permissionRouter);
rootRouter.use(purchaseRouter);
rootRouter.use(notificationRouter);



module.exports = rootRouter;
