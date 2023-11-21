const User=require('../model/user')

exports.showLeaderBoard=async(req,res)=>{
    try{
        const showLeaderBoardOfUsers = await User.find()
            .sort({ totalExpenses: 'desc' });


        if(showLeaderBoardOfUsers.length===0){
            return res.status(400).json({err:"No Leaderboard Till Now"})
        }
       
        res.status(200).json(showLeaderBoardOfUsers)

    }catch(err){
        res.status(500).json(err)
    }
}