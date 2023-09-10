const express = require('express');
require('dotenv').config();

const app = express();
const {userRoute,photoRoute,commentRoute} = require('../route')
const errorMiddleware = require('../middleware/errorMiddleware');

app.use(express.json());

app.use('/users',userRoute);
app.use('/photos',photoRoute);
app.use('/comments',commentRoute);

app.use(errorMiddleware);

app.use((req,res)=>{
    return res.status(404).json({
        status : 'fail',
        message : 'Route Not Found',
    });
});


module.exports = app;