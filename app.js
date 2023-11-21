const express = require('express');
const bodyParser = require('body-parser');
const mongoose=require('mongoose')
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Routes imported
const userRoute = require('./routes/user');
const expenseRoute = require('./routes/expense');
const purchaseRoute = require('./routes/purchase');
const premiumRoute = require('./routes/premium');
const passwordRoute = require('./routes/password');



const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use('/user', userRoute);
app.use('/expense', expenseRoute);
app.use('/purchase', purchaseRoute);
app.use('/premium', premiumRoute);
app.use('/password', passwordRoute);

app.use((req, res) => {
    res.sendFile(path.join(__dirname, `public/${req.url}` ));
});


mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log('Connected to mongoose')
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    })
  })
  .catch((err) => {
    console.log('Error in connection', err)
  })
