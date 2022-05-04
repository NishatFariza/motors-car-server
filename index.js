const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;
const app = express();


//middleware
app.use(cors());
app.use(express.json())

//connect to database
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bymrp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
   try{
       await client.connect()
       const carsCollection = client.db("motorsHouse").collection("cars");

       //all data load
        app.get('/cars', async(req, res) =>{
            const query ={}
            const cursor = carsCollection.find(query);
            const cars = await cursor.toArray();
            // console.log(cars);
            res.send(cars)
        })

        //get single data by id
        app.get('/inventory/:id', async(req, res) =>{
            const id = req.params.id;
            console.log(id);
            const query = {_id: ObjectId(id)};
            const car = await carsCollection.findOne(query);
            res.send(car)
        })


        //update data
        app.put('/inventory/:id', async(req, res) =>{
            const newCar = req.body;
            console.log(newCar);
            const id = req.params.id; 
            console.log(id);
            const filter = {_id: ObjectId(id)};
            const options = { upsert: true };
            const updateDoc = {
                $set: newCar,
              };
            const car = await carsCollection.updateOne(filter, updateDoc, options);
            res.send(car)
        })


   }
   finally{

   }
}

run().catch(console.dir)






//root api
app.get('/', (req, res)=>{
    res.send('Response motors server')
})
//for listen
app.listen(port, () =>{
    console.log('Listening to', port);
})