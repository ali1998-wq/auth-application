const mongoose=require('mongoose');

const permissionsSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
    },
    content:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Content",
    },
    usersWithAccess:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users",
    }],
    groupsWithAccess:[{
        type:String,
    }],
},{timestamps:true});

module.exports=mongoose.model('Permissions',permissionsSchema);