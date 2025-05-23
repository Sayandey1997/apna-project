const mongoose = require("mongoose");
const { Schema } = mongoose;

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/relationDemo1")
  .then(() => {
    console.log("MongoDB connection successful");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Define the Order schema
const orderSchema = new Schema({
  item: String,
  price: Number,
});

// Define the Customer schema
const customerSchema = new Schema({
  name: String,
  orders: [
    {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
});

// Models
const Order = mongoose.model("Order", orderSchema);
const Customer = mongoose.model("Customer", customerSchema);

// Insertion function
const addCustomers = async () => {
  let cus1 = new Customer({
    name: "Rahul Kumar",
    orders: [],
  });

  let order1 = await Order.findOne({ item: "Chips" });
  let order2 = await Order.findOne({ item: "Chocolate" });

  cus1.orders.push(order1._id);
  cus1.orders.push(order2._id);

  let result = await cus1.save();
  console.log(result);
};

addCustomers();




// //insertion
// const addOrders = async () => {
// const res = await Order.insertMany([
//   {item : "Samosa", price: 12},
//   {item: "Chips", price: 10 },
//   {item: "Chocolate", price: 40}
// ]
// );

// console.log(res);


//   }

// addOrders();