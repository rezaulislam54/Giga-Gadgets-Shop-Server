const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;


// middleware
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
    const productCartCollection = client.db('productDB').collection('Cart-Products');

    app.get("/products", async(req, res) => {
        const result = await productCollection.find().toArray();
        res.send(result);
    })


    app.get("/products/:id", async(req, res) => {
        const id = req.params.id;
        const quiry = {_id: new ObjectId(id)};
        const product = await productCollection.findOne(quiry);
        res.send(product);
    })


    app.get("/products/email/:email", async(req, res) => {
        const quiry = {email: req.params.email}
        const products = await productCollection.find(quiry).toArray();
        res.send(products);
    })


    app.get("/products/brand/:brand", async(req, res) => {
       const filter = {brand: req.params.brand}
        const products = await productCollection.find(filter).toArray();
        res.send(products);
    })


    app.post("/products", async(req, res) => {
        const product = req.body;
        const result = await productCollection.insertOne(product);
        res.send(result);
    })

    app.put("/products/:id", async(req, res) => {
        const id = req.params.id;
        const product = req.body;
        const options = { upsert: true };
        const filter = { _id: new ObjectId(id) };
        const updateDoc = { 
            $set:{
            name: product.name,
            price: product.price,
            image: product.image,
            type: product.type,
            brand: product.brand,
            rating: product.rating,
            description: product.description,
            email: product.email
            } 
         };
        const result = await productCollection.updateOne(filter, updateDoc, options);
        res.send(result);
    })

    app.delete("/products/:id", async(req, res) => {
        const id = req.params.id;
        const result = await productCollection.deleteOne({ _id: new ObjectId(id) });
        res.send(result);
    })


    // cartCollection
    app.get("/carts", async(req, res) => {
        const result = await productCartCollection.find().toArray();
        res.send(result);
    })

    app.get("/carts/:id", async(req, res) => {
        const id = req.params.id;
        console.log(id);
        const quiry = {_id: new ObjectId(id)};
        const product = await productCartCollection.findOne(quiry);
        res.send(product);
    })
  
    app.get("/carts/email/:email", async(req, res) => {
        const email = req.params.email;
        const quiry = {email: email}
        const products = await productCartCollection.find(quiry).toArray();
        res.send(products);
    })

    app.post("/carts", async(req, res) => {
        const product = req.body;
        const result = await productCartCollection.insertOne(product);
        res.send(result);
    })

    app.delete("/carts/:id", async(req, res) => {
        const id = req.params.id;
        const result = await productCartCollection.deleteOne({ _id: new ObjectId(id) });
        res.send(result);
    })

    // brandCollection
    app.get("/brands", async(req, res) => {
        const result = await productBrandsCollection.find().toArray();
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



app.get('/', (req, res) => {
    res.send('Giga Gadgets shop server Running')
})

app.listen(port,()=>{
    console.log(`Giga Gadgets Server is running on port ${port}`)
 })
