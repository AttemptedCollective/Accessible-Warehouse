'use static';

const express = require('express');
const app = express();
const http = require('http');
const db = require('./sqlQueries.js');
const server = http.createServer(app);

// Use express to serve files (webserver)
app.use('/', express.static('src'));

const PORT = process.env.PORT || 80;
server.listen(PORT, () => {
  console.log(`Server started, Listening on port ${PORT}`);
});

// API functions
// post functions
app.post('/api/addStockType', addStockType);
app.post('/api/addNewDelivery', addNewDelivery);
// get functions
app.get('/api/getRegionList', getRegionList);
app.get('/api/getClusterList', getClusterList);
app.get('/api/getStoreList', getStoreList);
app.get('/api/getEarliestDate', getEarliestDate);
app.get('/api/getLatestDate', getLatestDate);
app.get('/api/getStockTypes', getStockTypes);
app.get('/api/getOutgoingDeliveries', getOutgoingDeliveries);
app.get('/api/getStockTotals', getStockTotals);
app.get('/api/getMonthlyTotals', getMonthlyTotals);
app.get('/api/getBreakdownByStock', getBreakdownByStock);


// Server Functions
// ADD
async function addStockType(req, res) {
  try {
    const stock_name = req.query.stock_name;
    const average_weight = req.query.average_weight;
    const addStatus = await db.addStockType(stock_name, average_weight); //Add the Stock Type to the database
    io.sockets.emit('broadcast', "Database Updated");
    res.send(addStatus); //return to the client whether the Stock type was added or not
  }
  catch (error) {
    console.log("API Error: ",error);
    res.send("Server Error");
  }
}

async function addNewDelivery(req, res) {
  try {
    const fromLocation = req.query.fromLocation;
    const toLocation = req.query.toLocation;
    const stockType = req.query.stockType;
    const numOfBags = req.query.numOfBags;
    const driverID = req.query.driverID;
    const deliveryDueDate = req.query.deliveryDueDate;
    const addStatus = await db.addNewDelivery(fromLocation, toLocation, stockType, numOfBags, driverID, deliveryDueDate); //Add the Delivery to the database
    io.sockets.emit('broadcast', "Database Updated");
    res.send(addStatus); //return to the client whether the Delivery was added or not
  }
  catch (error) {
    console.log("API Error: ",error);
    res.send("Server Error");
  }
}

// GET
async function getStockTypes(req, res) {
  try {
    const data = await db.getStockTypes();
    res.send(data);
  }
  catch (error) {
    console.log("API Error: ",error);
    res.send("Server Error");
    }
}

async function getClusterList(req, res) {
  try {
    const data = await db.getClusterList();
    res.send(data);
  }
  catch (error) {
    console.log("API Error: ",error);
    res.send("Server Error");
    }
}

async function getRegionList(req, res) {
  try {
    const data = await db.getRegionList();
    res.send(data);
  }
  catch (error) {
    console.log("API Error: ",error);
    res.send("Server Error");
    }
}

async function getStoreList(req, res) {
  try {
    const data = await db.getStoreList();
    res.send(data);
  }
  catch (error) {
    console.log("API Error: ",error);
    res.send("Server Error");
    }
}

async function getEarliestDate(req, res) {
  try {
    const data = await db.getEarliestDate();
    res.send(data);
  }
  catch (error) {
    console.log("API Error: ",error);
    res.send("Server Error");
    }
}

async function getLatestDate(req, res) {
  try {
    const data = await db.getLatestDate();
    res.send(data);
  }
  catch (error) {
    console.log("API Error: ",error);
    res.send("Server Error");
    }
}

async function getOutgoingDeliveries(req, res) {
  try {
    const isNull = req.query.isNull;
    const today = req.query.today;
    const data = await db.getOutgoingDeliveries(isNull, today);
    res.send(data);
  }
  catch (error) {
    console.log("API Error: ",error);
    res.send("Server Error");
    }
}

async function getStockTotals(req, res) {
  try {
    const dateFrom = req.query.dateFrom;
    const dateTo = req.query.dateTo;
    const data = await db.getStockTotals(dateFrom, dateTo);
    res.send(data);
  }
  catch (error) {
    console.log("API Error: ",error);
    res.send("Server Error");
  }
}

async function getMonthlyTotals(req, res) {
  try {
    const data = await db.getMonthlyTotals();
    res.send(data);
  }
  catch (error) {
    console.log("API Error: ",error);
    res.send("Server Error");
    }
}

async function getBreakdownByStock(req, res) {
  try {
    const dateFrom = req.query.dateFrom;
    const dateTo = req.query.dateTo;
    const data = await db.getBreakdownByStock(dateFrom, dateTo);
    res.send(data);
  }
  catch (error) {
    console.log("API Error: ",error);
    res.send("Server Error");
    }
}
