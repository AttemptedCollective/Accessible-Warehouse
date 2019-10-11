'use static';

const express = require('express');
const app = express();
const mysql = require('mysql2/promise');
const db = require('./sql-queries.js');

// Use express to serve files (webserver)
app.use('/', express.static('src'));


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server started, Listening on port ${PORT}`);
});

//API functions
app.post('/api/addStockType', addStockType);

//Server Functions

async function addStockType(req, res) {
  try {
    //const userId = req.user.id; //GoogleAuth ID
    const stockName = req.query.stockName;
    const averageWeight = req.query.averageWeight;
    const addStatus = await db.addStockType(stockName, averageWeight, userId); //Add the Stock Type to the database
    res.send(addStatus); //return to the client whether the Stock type was added or not
  }
  catch (error) {
    console.log("\x1b[31mAPI (AddStockType) Error: \x1b[37m%s\x1b[0m",error);
    res.send("Server Error: Please log in again");
  }
}
