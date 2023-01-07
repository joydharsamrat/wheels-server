const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();


app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ihoeb4c.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const productsCollection = client.db('wheels').collection('products');
async function run() {
    try {
        app.get('/products', async (req, res) => {
            const query = {}
            const result = await productsCollection.find(query).toArray()
            res.send(result)
        })

        app.patch('/products', async (req, res) => {
            const id = req.query.id;
            const { price } = req.body;
            const query = { _id: ObjectId(id) }
            const updatedDoc = {
                $set: {
                    price: price
                }
            }
            const result = await productsCollection.updateOne(query, updatedDoc)
            res.send(result)
        })

        app.post('/products', async (req, res) => {
            const product = req.body;
            const result = await productsCollection.insertOne(product)
            res.send(result)
        })
    }
    finally {

    }
}

run().catch((err) => console.log(err))

app.get('/', (req, res) => {
    res.send('wheels server is running')
})

app.listen(port, () => {
    console.log('server is running on', port)
})