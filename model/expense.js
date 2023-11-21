const mongoose = require('mongoose')
const Schema = mongoose.Schema

const expenseSchema = new Schema({
    day: {
        type: Number
    },
    month: {
        type: Number
    },
    year: {
        type: Number
    },
    amount: {
        type: Number,
        required: true
    },
    description: {
        type: String, 
        required: true
    },
    category: {
        type: String, 
        required: true
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true

    }
});

module.exports = mongoose.model('Expense', expenseSchema)

