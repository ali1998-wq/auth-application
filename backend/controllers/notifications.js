const Notification=require("../models/notifications");
const {commonResponse}=require("../utils/response/response");

exports.getNotifications=async(req,res)=>{
    try {
        const {id}=req.params;
        if(!id){
            return res.status(400).json(commonResponse("Invalid user id",false));
        }
        const notifications=await Notification.find({authorId:id});
        if(notifications){
            return res.status(200).json(commonResponse("Notifications found",true,notifications));
        }
        else{
            return res.status(404).json(commonResponse("Notifications not found",false));
        }
    } catch (error) {
        res.status(500).json(commonResponse("Server error",false));
    }
}