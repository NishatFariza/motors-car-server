const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;
const app = express();


//middleware
app.use(cors());
app.use(express.json())

//connect to database
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bymrp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const motorCollection = client.db("motorHouse").collection("cars");





//root api
app.get('/', (req, res)=>{
    res.send('Response motors server')
})
//for listen
app.listen(port, () =>{
    console.log('Listening to', port);
})