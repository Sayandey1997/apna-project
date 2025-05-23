const mongoose = require("mongoose");
const { data } = require("../init/data.js");  // Destructure to get 'data' from the imported file
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
    // Once connected, initialize the database
    initDB();
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

// Correct function to initialize data
const initDB = async () => {
  await Listing.deleteMany({}); // Delete existing data in the Listing collection
  const dataWithOwner = data.map((obj) => ({...obj, owner : "6826e27b7492ddc8789b8dcd"})

);
  await Listing.insertMany(dataWithOwner); // Insert the data imported from data.js
  console.log("data was initialized");
};
