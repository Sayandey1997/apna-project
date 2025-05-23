// relationship/user.js

const mongoose = require("mongoose");




// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/relationDemo")
  .then(() => {
    console.log("MongoDB connection successful");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Define the User schema
const userSchema = new mongoose.Schema({
  username : String,
  addresses: [{
    location: String,
    city: String
  },
],
});

// Create the User model
const User = mongoose.model("User", userSchema);

// Create a new user
const addUsers = async () => {
  let user1 = new User({
    username: "Sayan Dey",
    addresses: [{
      location: "Kolkata",
      city: "Asansol"
    }]
  });
user1.addresses.push({ location: "P32 WALLSTREET", city: "London"});

 let result = await user1.save();
  console.log("Saved User:", result);
};

addUsers();
