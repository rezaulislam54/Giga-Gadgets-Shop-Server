const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
require('dotenv').config()
const port = process.env.PORT || 4000;


// middlewire
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hflxk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    
    await client.connect();

    const productBrandsCollection = client.db('productDB').collection('products');
    const productCollection = client.db('productDB').collection('all_products');
    
    // Brand Cullection Get
    app.get("/brands", async(req,res)=>{
        const cursor = productBrandsCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

        app.get("/products", async(req,res)=>{
        const cursor = productCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    app.get("/products/:id", async(req,res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await productCollection.findOne(query);
        res.send(result);
    })


     app.get("/products/:brand", async(req, res) =>{
      const query = {brand: req.params.brand};
      const result = await productCollection.find(query).toArray();
      res.send(result);
    })


     app.get("/products/:email", async(req, res) =>{
      const query = {email: req.params.email}
      const result = await productCollection.find(query).toArray();
      res.send(result);
    })


    app.post("/Products", async(req, res)=>{
      const product = req.body;
      const result = await productCollection.insertOne(product);
      res.send(result);
    })
    

    app.put("/Products/:id", async(req, res)=>{
      const id = req.params.id;
      const Product = req.body;
      const query = {_id: new ObjectId(id)};
       const options = { upsert: true };
      const updatedProduct = {
        $set: {
            name: Product.name,
            price: Product.price,
            image: Product.image,
            type: Product.type,
            brand: Product.brand,
            rating: Product.rating,
            description: Product.description
        }
      }
      const result = await productCollection.updateOne(query, updatedProduct, options);
      res.send(result);
    })


    
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res)=>{
    res.send('Giga Gadets Shop Server is Running');
})

app.listen(port, ()=>{
    console.log(`Giga Gadets Shop Server is Running port ${port}`);
})