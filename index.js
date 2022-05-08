const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;
const app = express();


//middleware
app.use(cors());
app.use(express.json())

//verified jwt
function verifyJWT(req, res, next){
    const authHeader = req.headers.authorization;
    console.log(authHeader);
    if(!authHeader){
        return res.status(401).send({message: 'Unauthorized access'})
    }
    const token = authHeader.split(' ')[1]
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded)=>{
        if(err){
            console.log(err);
            return res.status(403).send({message: 'Forbidden access'})
        }
        // console.log('decoded', decoded);
        req.decoded=decoded
        next()
    })
    // console.log('insideVerifyJWT', token);
    // next()
}

//connect to database
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bymrp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
   try{
       await client.connect()
       const carsCollection = client.db("motorsHouse").collection("cars");


        //auth
        app.post('/login', async(req, res)=>{
            const user =req.body;
            // console.log(user);
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '30d'
            })
            res.send({accessToken})
        })

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

        //delete api
        app.delete('/inventory/:id', async(req, res) =>{
            const id = req.params.id;
            console.log(id);
            const query = {_id: ObjectId(id)};
            const result = await carsCollection.deleteOne(query);
            res.send(result)
        })

        //post api
        app.post('/inventory', async(req, res) =>{
            const car = req.body;
            const result = await carsCollection.insertOne(car);
            res.send(result)
        })

        app.get("/inventory", verifyJWT, async (req, res) => { 
            const decodedEmail = req.decoded.email; 
            const email = req.query.email;
             console.log( email, decodedEmail);
              if (email === decodedEmail) {
               const query = { email }
               const cursor = carsCollection.find(query) 
               const result = await cursor.toArray(); 
               console.log(result); 
               res.send(result) 
            } 
               else {
                    console.log("error"); 
               res.status(403).send({ message: "forbidden access" })
            
            }
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