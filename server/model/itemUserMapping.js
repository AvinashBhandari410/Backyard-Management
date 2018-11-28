var mongoose= require('mongoose');

var ItemSchema=new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});
mongoose.model('ItemUserMapping',ItemSchema);

module.exports=mongoose.model('ItemUserMapping');