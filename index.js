const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.port || 5000;

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.l5wiuzk.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const servicesCollection = client.db("careerMaker").collection("services");
    const bookingCollection = client.db("careerMaker").collection("bookings");

    // insert services
    app.post('/services', async(req, res)=>{
      const newServices = req.body;
      console.log(newServices);
      const result = await servicesCollection.insertOne(newServices);
      res.send(result);
    })

    // read services
    app.get('/services', async(req, res)=>{
      console.log(req.query.email)
      let query = {};
      if(req.query?.email){
        query = {email: req.query.email}
      }
      const cursor = servicesCollection.find(query);
      const result = await cursor.toArray();
      res.send(result)
    })

    // update services
    app.get('/services/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await servicesCollection.findOne(query);
      res.send(result);
    })
    app.put('/services/:id', async(req, res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options = { upsert : true }
      const updateServices = req.body;
      const services = {
        $set : {
          name: updateServices.name,
          providerName: updateServices.providerName,
          email: updateServices.email,
          area: updateServices.area,
          providerPhoto: updateServices.providerPhoto,
          description: updateServices.description,
          price: updateServices.price,
          photo: updateServices.photo
           
        }
      }
      const result = await servicesCollection.updateOne(filter, services, options);
      res.send(result);
    })

    // service delete
    app.delete('/services/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await servicesCollection.deleteOne(query)
      res.send(result)
    })

    

    // Booking services
    // insert bookings
    app.post('/bookings', async(req, res)=>{
      const newBookings = req.body;
      console.log(newBookings);
      const result = await bookingCollection.insertOne(newBookings);
      res.send(result);
    })

    // read bookings
    app.get('/bookings', async(req, res)=>{
      console.log(req.query.email);
      let query = {};
      if(req.query?.email){
        query = {email: req.query.email}
      }
      const cursor = bookingCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    })
   

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/', (req, res)=>{
    res.send("career is running.")
})

app.listen(port, ()=>{
    console.log(`career maker is running ${port}`);
})
