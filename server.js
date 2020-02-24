'use static';

const express = require('express');
const app = express();
const mysql = require('mysql2/promise');
const http = require('http');
const db = require('./sqlQueries.js');
const server = http.createServer(app);
// const io = require('socket.io')(http);

// Use express to serve files (webserver)
app.use('/', express.static('src'));

const io = require('socket.io').listen(server);

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

let pool;
const createPool = async () => {
  pool = await mysql.createPool({
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    socketPath: `/cloudsql/${process.env.CLOUD_SQL_CONNECTION_NAME}`,
  });
};
createPool();

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server started, Listening on port ${PORT}`);
});

// API functions
app.post('/api/addStockType', addStockType);
app.post('/api/addNewDelivery', addNewDelivery);
app.get('/api/getAreaList', getAreaList);
app.get('/api/getStoreList', getStoreList);
app.get('/api/getEarliestDate', getEarliestDate);
app.get('/api/getLatestDate', getLatestDate);
app.get('/api/getUpcomingDeliveries', getUpcomingDeliveries);
app.get('/api/getStockTypes', getStockTypes);
app.get('/api/getDeliveryReceipts', getDeliveryReceipts);
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

async function getAreaList(req, res) {
  try {
    const data = await db.getAreaList();
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

async function getUpcomingDeliveries(req, res) {
  try {
    const data = await db.getUpcomingDeliveries();
    res.send(data);
  }
  catch (error) {
    console.log("API Error: ",error);
    res.send("Server Error");
    }
}

async function getDeliveryReceipts(req, res) {
  try {
    const startIndex = parseInt(req.query.startIndex);
    const numberOfRecords = parseInt(req.query.numberOfRecords);
    const data = await db.getDeliveryReceipts(startIndex, numberOfRecords);
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
