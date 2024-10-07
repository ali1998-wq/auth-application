const mongoose=require('mongoose');

const contentSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    body:{
        type:String,
        required:true,
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users",
    },
    amount:{
        type:Number,
        required:true,
    },
    type:{
        type:String,
        required:true,
    },
    permission:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Permissions",
    }
},{timestamps:true});

module.exports=mongoose.model('Content',contentSchema);