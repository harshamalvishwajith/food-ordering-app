//this is the main server file for isara guest backend

const express = require("express");
const cors = require("cors");
const checkoutRoutes = require("./routes/checkout");
//defining the app
const app = express();

//enable the cors in all routes

app.use(cors());

//Middleware to parse json

app.use(express.json());

//default test route
app.get("/", (req, res) => {
  res.send("backend connected - payhere service - food ordering app");
});

//register routes
app.use(checkoutRoutes);

//Starting server

const PORT = 3020;

app.listen(PORT, () => {
  console.log(`Payhere Server is running at port number:${PORT}`);
});
