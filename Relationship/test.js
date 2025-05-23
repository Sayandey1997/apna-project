
//conncetion mongodb - collections  and documents
const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/userOrderDemo")
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.log("❌ Connection error:", err));



// User schema
const userSchema = new mongoose.Schema({
    name: String,
    city: String,
  });
  
  // Order schema with reference to user
  const orderSchema = new mongoose.Schema({
    item: String,
    price: Number,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  });
  
  // Models
  const User = mongoose.model("User", userSchema);
  const Order = mongoose.model("Order", orderSchema);

  
  //insertion
  const createData = async () => {
    const user1 = new User({ name: "Rahul1", city: "Bangalore" });
    const savedUser = await user1.save();
  
    const order1 = new Order({ item: "Pen", price: 10, user: savedUser._id });
    const order2 = new Order({ item: "Notebook", price: 50, user: savedUser._id });
  
    await order1.save();
    await order2.save();
  
    console.log("📦 Data inserted");
  };
  
  createData();


//   //read data
//   const readData = async () => {
//     const users = await User.find();
//     console.log("👤 Users:", users);
  
//     const orders = await Order.find().populate('user');
//     console.log("🧾 Orders with user info:", orders);
//   };
  
//   readData();

  

//   //update
//   const updateData = async () => {
//     const user = await User.findOne({ name: "Rahul1" });
//     user.city = "Mumbai";
//     await user.save();
//     console.log("✅ Updated user:", user);
//   };
  
//   updateData();

//delete
const deleteData = async () => {
    const user = await User.findOne({ name: "Rahul1" });
    await Order.deleteMany({ user: user._id }); // delete user's orders
    await User.deleteOne({ _id: user._id });    // delete user
    console.log("❌ Deleted user and their orders");
  };
  
  deleteData();
  
  