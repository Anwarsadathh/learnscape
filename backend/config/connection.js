const { MongoClient } = require("mongodb");
require("dotenv").config();

const dbname = "scape";

const state = {
  db: null,
  promise: null,
};

// Lazily establish (and cache) the MongoDB connection. Safe for serverless:
// the connection is created once per warm instance and reused across requests.
// On failure the cached promise is cleared so the next request can retry,
// and it never calls process.exit (which would crash the function).
function ensureConnected() {
  if (state.db) return Promise.resolve(state.db);

  if (!state.promise) {
    const url = process.env.MONGODB_URI;
    if (!url) {
      return Promise.reject(new Error('MONGODB_URI not found in environment variables'));
    }

    const client = new MongoClient(url);
    state.promise = client
      .connect()
      .then((connectedClient) => {
        state.db = connectedClient.db(dbname);
        console.log("Connected to MongoDB successfully");
        console.log("Database name:", state.db.databaseName);
        return state.db;
      })
      .catch((err) => {
        console.error("Error connecting to MongoDB:", err);
        state.promise = null; // allow a retry on the next request
        throw err;
      });
  }

  return state.promise;
}

// Kept for backwards compatibility with callers that use connect(done).
module.exports.connect = function (done) {
  ensureConnected()
    .then(() => done && done())
    .catch((err) => done && done(err));
};

module.exports.ensureConnected = ensureConnected;

module.exports.get = function () {
  return state.db;
};
