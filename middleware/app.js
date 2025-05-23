const express = require('express');
const app = express();
const ExpressError = require("./ExpressError");

// app.use((req,res, next) => {
//    console.log("i am middleware ");
//    next();

// });

// app.use((req, res, next) => {
//       console.log(req.method);
//       next();
    
//      });



// app.use((req, res, next) => {
//    let {token} = req.query;
//    if(token=== "give"){
//     next();
//    }
//    throw new ExpressError(401, "Access Denied");
//    });


   app.get("/api", (req, res) => {
    res.send("data");
       });
   app.get("/", (req,res) => {
    res.send("Hi i am root1");

});


app.get("/random", (req,res) => {
    res.send("Hi its a radnom page");

});

// app.get("/err", (req, res, next) => {
//     try {
//         abcd = abcd; // This will throw
//     } catch (err) {
//         next(err); // Pass the error to error-handling middleware
//     }
// });

// Error-handling middleware
app.use((err, req, res, next) => {
    const { status = 500, message = "Something went wrong!" } = err;
    console.log("Error caught:", message);
    res.status(status).send(message);
});


app.get("/admin", (req, res) => {
   throw new ExpressError(403, "Acess is probiden")
});
            
app.listen(8080, () => {
console.log("server listening to 8080");



})

