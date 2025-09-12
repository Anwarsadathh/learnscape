const { MongoClient } = require("mongodb");
require("dotenv").config();

const state = {
  db: null,
};

module.exports.connect = function (done) {
  // Use MONGODB_URI to match your .env file
  const url = process.env.MONGODB_URI;
  const dbname = "scape";

  // Add debug logging
  console.log('MongoDB URI loaded:', url ? 'Yes' : 'No');
  
  if (!url) {
    console.error('MONGODB_URI not found in environment variables');
    return done(new Error('MONGODB_URI not found'));
  }

  // Remove deprecated options
  MongoClient.connect(url)
    .then((client) => {
      state.db = client.db(dbname);
      console.log("Connected to MongoDB successfully");
      console.log("Database name:", state.db.databaseName);
      done();
    })
    .catch((err) => {
      console.error("Error connecting to MongoDB:", err);
      done(err);
    });
};

module.exports.get = function () {
  return state.db;
};
