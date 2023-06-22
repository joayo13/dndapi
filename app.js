const express = require('express');
const jwt = require('jsonwebtoken');
const router = require('./routes/router');
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()
const mongoDb = process.env.MONGO_URL;
mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json())
app.use(cors())
app.use(router)


app.listen(5000, () => console.log('server started on 5000'))