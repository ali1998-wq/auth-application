const mongoose=require('mongoose');

const rolesSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        enum:["user","admin","author"],
    },
    permissions:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Permissions",
    }]
},{timestamps:true});

module.exports=mongoose.model('Roles',rolesSchema);