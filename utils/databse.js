//Dependencies
const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

const ObjectId = mongodb.ObjectId;

const url =
  "mongodb+srv://minggu99:minggu99@cluster0.8ty0e.mongodb.net/task?retryWrites=true&w=majority";

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((client) => {
      _db = client.db();
      callback(_db);
    })
    .catch((err) => callback(err));
};

const getDb = () => {
  if (_db) return _db;
  return null;
};

mongoConnect((db) => {
  db.collection("users")
    .find({age: {$gt: 18}})
    .toArray()
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
});

// exports.mongoConnect = mongoConnect;
// exports.getDb = getDb;
