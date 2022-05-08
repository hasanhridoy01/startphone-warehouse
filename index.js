const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

//use middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mgfop.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
  try{
    await client.connect();
    const productCollection = client.db('phoneWareHouse').collection('phone');

    //get all product
    app.get('/product', async(req, res) => {
      const query = {};
      const cursor = productCollection.find(query);
      const products = await cursor.toArray();
      res.send(products);
    });

    //get all product by email
    app.get('/items', async(req, res) => {
      const email = req.query.email;
      const query = {email: email};
      const cursor = productCollection.find(query);
      const products = await cursor.toArray();
      res.send(products);
    });

    //get single product by using id
    app.get('/product/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const product = await productCollection.findOne(query);
      res.send(product);
    });

    //add new product
    app.post('/product', async(req, res) => {
      const newProduct = req.body;
      const result = await productCollection.insertOne(newProduct);
      res.send(result);
    });

    //delete single product by using id
    app.delete('/product/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const result = await productCollection.deleteOne(query);
      res.send(result);
    })

    //update product
    app.put('/update/:id', async(req, res) => {
      const id = req.params.id;
      const updatedProduct = req.body;
      console.log(updatedProduct);
      const filter = {_id: ObjectId(id)};
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          name: updatedProduct.name,
          description: updatedProduct.description,
          price: updatedProduct.price,
          email: updatedProduct.email,
          quantity: updatedProduct.quantity,
          supplier: updatedProduct.supplier,
          img: updatedProduct.img
        }
      };
      const result = await productCollection.updateOne(filter, updatedDoc, options);
      res.send(result);
    })

    //update one items
    app.put('/quantity/:id', async(req, res) => {
      const id = req.params.id;
      const updatedProduct = req.body.quantity;
      // console.log(typeof(updatedProduct));
      const filter = {_id: ObjectId(id)};
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          quantity: updatedProduct,
        }
      };
      const result = await productCollection.updateOne(filter, updatedDoc, options);
      res.send(result);
    })

    //update one items decrement
    app.put('/quantityminus/:id', async(req, res) => {
      const id = req.params.id;
      const updateQuantity = req.body.quantity;
      const filter = {_id: ObjectId(id)};
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          quantity: updateQuantity,
        }
      };
      const result = await productCollection.updateOne(filter, updatedDoc, options);
      res.send(result);
    })
  }
  finally{}
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Server on Running');
});

app.listen(port, () => {
  console.log("Lisitening", port);
})