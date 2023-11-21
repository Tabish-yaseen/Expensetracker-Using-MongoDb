
const Expense=require('../model/expense')
const User=require('../model/user')

function isStringNotValid(string){
    if(string===undefined || string.length===0){
        return true
    }
    else{
        return false
    }
}



exports.addExpenses=async(req,res)=>{
    const user=req.user
    const userId=req.user._id
    
    try{
        const{amount,description,category}=req.body
        if(isStringNotValid(amount) || isStringNotValid(description) || isStringNotValid(category)){
            return res.status(400).json({error:"something is missing"})

        }
        const currentDate=new Date()
        const day=currentDate.getDate()
        const month=currentDate.getMonth()+1
        const year=currentDate.getFullYear()
     
        const expense= new Expense({day,month,year,amount,description,category,userId})
        await expense.save()

         const totalAmount=Number(user.totalExpenses)+Number(amount)

         await User.updateOne({_id:userId},{
           $set:{ totalExpenses:totalAmount
           }})


        res.status(200).json(expense)
    }catch(err){

        res.status(500).json({error:err})
    }

}

exports.getExpenses=async (req,res)=>{
    try {
        const page = Number(req.query.page) || 1;
        const itemsPerPage= Number(req.query.expensePerPage);
        // console.log(itemsPerPage)
    
        const userId = req.user._id;
        
    
        const expenses = await Expense.find({userId:userId})
          .skip((page - 1) * itemsPerPage)
          .limit(itemsPerPage)
        
    
        // total count of expenses of the user
        const totalCount = await Expense.countDocuments({userId:userId});
    
        const lastPage = Math.ceil(totalCount / itemsPerPage);
    
        res.status(200).json({
          expenses:expenses,
          pagination:{
            currentPage: page,
            hasNextPage: page < lastPage-1,
            nextPage: page + 1,
            hasPreviousPage: page > 1,
            previousPage: page - 1,
            lastPage:lastPage

          }
          
        });
      } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve expenses' });
      }
    }


exports.deleteExpense=async(req,res)=>{
    try{
        const user=req.user
    const id=req.params.id

    const expense=await Expense.findOneAndDelete({_id:id})
    console.log(expense)
    if(!expense){
        return res.status(404).json({ error: 'Expense not found' });
    }
    const totalAmount=Number (user.totalExpenses) - Number(expense.amount)
    await User.updateOne({_id:user.id},{
       $set:{ totalExpenses:totalAmount
    }})
    // await expense.deleteOne()

    return res.status(200).json({message:'Successfully deleted the expense'})
    }catch(err){
        res.status(500).json({error:err})
    }

}

exports.getDayExpenses = async (req, res) => {
    try {
        const { day, month, year } = req.query;
        const user = req.user;
        const dayExpenses = await Expense.find( { day: day, month: month, year: year,userId:user._id} );
        if(dayExpenses.length==0){
         return res.status(400).json({error:"No Expenses Of This Day"})
        }
        
        
        let totalAmount = 0;
        for (let expense of dayExpenses) {
            totalAmount += expense.amount;
        }

        res.status(200).json({ expenses: dayExpenses, totalAmount: totalAmount });
    } catch (err) {
        res.status(500).json({ error: err });
    }
}

exports.getMonthExpenses=async(req,res)=>{
    try{
        const{month,year}=req.query;
        const user=req.user;
        const monthExpenses=await Expense.find({month:month,year:year,userId:user._id})
        if(monthExpenses.length==0){
            return res.status(400).json({error:"No Expenses Of This Month"})
           }

        let totalAmount=0
        for(let expense of monthExpenses){
            totalAmount+=expense.amount
        }
        console.log(totalAmount)
        res.status(200).json({expenses:monthExpenses,totalAmount:totalAmount})

    }catch (err) {
        res.status(500).json({ error: err });
    }
}
