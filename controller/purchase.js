const Order = require('../model/order');
const jwt=require('jsonwebtoken')
const Razorpay = require('razorpay');
require('dotenv').config();

function generateAccessToken(id,name,ispremium){
  return jwt.sign({userid:id,username:name,isPremium:ispremium},process.env.SECRET_KEY
      )
}

const rzp = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret:process.env.RAZORPAY_KEY_SECRET
});

exports.purchasePremium = async (req, res) => {
  try {
    const user = req.user;
    // console.log(user)

    // Create an order with the specified amount and currency
    const order = await rzp.orders.create({
      amount: 50000, 
      currency: 'INR',
    });

  
    const createdOrder = new Order({
      orderid: order.id, // Ensure the type matches the schema
      status: 'PENDING',
      userId:user._id
  });
  createdOrder.save()
    

    return res.status(201).json({ order: order, key_id: rzp.key_id });
  } catch (err) {
    // console.error(err);
    return res.status(500).json({ error: 'Failed to create order' });
  }
};

exports.updateTransaction=async(req,res)=>{
    try{
        const{orderId,paymentId}=req.body
        const user=req.user
      const order=  await  Order.findOne({orderid:orderId})

      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
    }
   const promise1= order.updateOne({paymentid:paymentId,status:'successful'})
    const promise2= user.updateOne({isPremium:true})
    Promise.all([promise1,promise2]).then(()=>{
      res.status(200).json({success:true,message:"Transaction successful",token:generateAccessToken(user.id,undefined,true)})

    }).catch((err)=>{
      throw new Error(err)
    })

    }catch(err){
        res.status(500).json({error:err})
    }

}