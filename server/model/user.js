var mongoose= require('mongoose');

var UserSchema=new mongoose.Schema({
    full_name:String,
    email_address: String,
    password:String,
    phone_number:Number,
    address:String,
    user_type:String,
    is_useractive: Boolean,
    created_date :String
});


mongoose.model('User',UserSchema);

module.exports=mongoose.model('User');