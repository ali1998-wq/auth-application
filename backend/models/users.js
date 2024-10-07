const mongoose=require('mongoose');
const bcrypt = require('bcryptjs');

const usersSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Roles',
    },
    status:{
        type:String,
        default:"unverified",
    },
    purchasedContent:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Content',
    }],
},{timestamps:true});

usersSchema.pre('save', async function(next) {
    if (this.isModified('password') || this.isNew) {
        try {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
            next();
        } catch (err) {
            next(err);
        }
    } else {
        return next();
    }
});

usersSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (err) {
        throw new Error(err);
    }
};

module.exports=mongoose.model('Users',usersSchema);