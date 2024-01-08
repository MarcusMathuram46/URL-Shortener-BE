const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const { MONGODB_URI, PORT } = require('./config');
const userRoute = require('./routes/users');

const app = express();

mongoose.set('strictQuery', false);

console.log('connecting to MONGODB...');
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('conected to MONGOBD...');
        app.listen(PORT, () => {
            console.log(`Server is running http://localhost:${PORT}`);
        })
    });

app.use(express.json());
app.use(cors());

app.use('/', userRoute);