var mongoose= require('mongoose');

var ItemSchema=new mongoose.Schema({
    isItemInterested: Boolean,
    //userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    //itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
    userId: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
    itemId: [{ type: mongoose.Schema.ObjectId, ref: 'Item' }]
});
mongoose.model('ItemInterest',ItemSchema);

module.exports=mongoose.model('ItemInterest');