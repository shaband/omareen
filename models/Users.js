const mongoose=require('mongoose');
var Schema=mongoose.Schema;
mongoose.Promise = global.Promise;

UserSchema=new Schema({
    name:{
        type:String,
        required:true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    Date:{
        type:Date,
        default:Date.now
    }
});
mongoose.model('Users',UserSchema);