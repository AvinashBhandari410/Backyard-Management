var mongoose= require('mongoose');

var ItemSchema=new mongoose.Schema({
    item_name:String,
    item_number: String,
    item_date:String,
    item_Location:String,
    longitude:Number,
    latitude:Number,
    item_description:String,
    item_image:String,
    item_cost:String,
    isItem_Approved: Boolean,
	isItem_Available: Boolean,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'ItemInterest' }
});
mongoose.model('Item',ItemSchema);

module.exports=mongoose.model('Item');