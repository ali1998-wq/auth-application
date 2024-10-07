const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    authorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    contentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Content"
    },
    buyerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    message:{
        type:String
    },
    isRead:{
        type:Boolean,
        default:false
    }
},{timestamps:true});

module.exports=mongoose.model("Notification",notificationSchema);