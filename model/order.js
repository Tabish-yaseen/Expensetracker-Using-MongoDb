const mongoose=require('mongoose')
const Schema=mongoose.Schema

const orderSchema=new Schema({
    paymentid:String,
    orderid:String,
    status: {
        type: String,
        default: 'PENDING',
      },
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    }


})
module.exports=mongoose.model('Order',orderSchema)
