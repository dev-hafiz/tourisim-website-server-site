const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

//Middleware
app.use(cors())
//Body parser
app.use(express.json())


//Database string
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.luy9u.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {

     try{
          await client.connect();
          console.log("Database connect Succesfully");

          const database = client.db("tourism_DB");
          const placeCollection = database.collection("places");
          const bookingCollection = database.collection("booking");

          //GET API
          app.get('/places', async(req, res)=>{
               const cursor = placeCollection.find({});
               const result = await cursor.toArray();
               res.json(result);
          })

          //Post Place
          app.post('/places', async(req, res)=>{
               const addPlace = req.body;
               const result  = await placeCollection.insertOne(addPlace)
               res.json(result)
          })

          //Post Place Booking
          app.post('/placeBooking', async(req, res)=>{
                    const bookingPlace = req.body;
                    const result = await bookingCollection.insertOne(bookingPlace)
                    res.json(result)
          })

          //Get bookin
          app.get('/myAllBooking/:email', async(req, res)=>{
               const result = await bookingCollection.find({
                    email: req.params.email,
               }).toArray()
               res.send(result);
          })

          //Delete Api
          app.delete ('/myBooking/:id', async(req, res)=>{
               const id = req.params.id;
               const qurey = { _id: ObjectId(id)};
               const result = await bookingCollection.deleteOne(qurey)
               res.json(result)
          })

          //GET API with id
          app.get('/places/:id', async(req, res)=>{
               const id = req.params.id;
               const query = { _id: ObjectId(id)};
               const result = await placeCollection.findOne(query);
               res.json(result);
          })


     }
     finally{
          // await client.close();
     }
}
run().catch(console.dir);

app.get('/', (req, res)=>{
     res.send("Running the Tourism Server")
})

app.listen(port, ()=>{
     console.log('Listening the port', port);
})