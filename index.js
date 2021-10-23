const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const port = 5000;
app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://mydbuser1:fSZU61JEsiE61XTn@cluster0.5va8k.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
async function run() {
  try {
    await client.connect();
    const database = client.db("oreBatper");
    const dataCollection = database.collection("chudu");
    //read data with get method
    app.get("/users", async (req, res) => {
      const cursor = dataCollection.find({});
      const users = await cursor.toArray();
      res.send(users);
    });
    //get signle user
    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      console.log("load user with id:", id);
      const user = await dataCollection.findOne(query);
      res.send(user);
    });
    // create a document to insert
    app.post("/users", async (req, res) => {
      const newUser = req.body;
      const result = await dataCollection.insertOne(newUser);
      res.json(result);
      console.log(result);
      //   const result = await dataCollection.insertOne(newUser);
      //   conso;
    });

    //delete
    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await dataCollection.deleteOne(query);
      console.log("deleteing id", result);
      res.json(result);
    });

    //update
    app.put("/users/:id", async (req, res) => {
      const id = req.params.id;
      const updateUser = req.body;
      const filter = { _id: ObjectId(id) };
      const updateDoc = {
        $set: {
          name: updateUser.name,
        },
      };
      const result = await dataCollection.updateOne(filter, updateDoc);
      console.log(result);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
