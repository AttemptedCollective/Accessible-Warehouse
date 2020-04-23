'use strict'

const mysql = require('mysql2/promise');
const config = require('./config.json');

let mysqlConn = null;

async function mysqlConnection() //Handles MySQL Database connections
{
  if (mysqlConn) //If a connection already exists
  {
    return mysqlConn; //Return the existing connection
  }
  else { //Else if no connection exists
    mysqlConn = newMysqlConnection(); //Make a new connection
    return mysqlConn; //Return the new connection
  }
}

async function newMysqlConnection() { //Creates a MySQL Database connection
  const newMysqlConn = await mysql.createConnection(config.mysql); //Create MySQL connection using the settings from the config
  return newMysqlConn; //Return the new connection
}

async function mysqlSelect(queryStr,queryVars){ //Runs MySQL Select Queries and returns results
  try {
  const sqlConnection = await mysqlConnection(); //get the connection
  const newQuery = sqlConnection.format(queryStr,queryVars); //format the query to avoid SQL Injection
  let [results, fields] = await sqlConnection.execute(newQuery) //run query
  return results; //return results
  }
  catch (error){
    console.log("SQL Failure: ",error);//catch SQL errors and print to console in colour
    return null; //return null as an SQL error was encountered trying to select
  }
}

async function mysqlInsert(queryStr,queryVars){ //Runs MySQL Insert Queries and returns whether the query was successful
  try {
  const sqlConnection = await mysqlConnection(); //get the connection
  const newQuery = sqlConnection.format(queryStr,queryVars); //format the query to avoid SQL Injection
  await sqlConnection.query(newQuery) //run query
  return true; //return true as any errors would drop to the catch statement below
  }
  catch (error){
    console.log("SQL Failure: ",error); //catch SQL errors and print to console in colour
    return false; //return false as there was an SQL error
  }
}


/*------------------------------------------------*\
    Adding to the database
\*------------------------------------------------*/

async function addUser(name, accessLevel, driverType){
  const Query = await mysqlInsert(
    'INSERT INTO User (name, accessLevel, driverType) VALUES (?,?,?)',
    [name, accessLevel, driverType]
  );
  if (Query){ //If Query was successfull (if not then error has already been printed to console)
    console.log('Added a New User: ', name);
    return true; //return true so that client can know User was added successfully
  }
  else {return false;} //return false so client can know User wasn't added
}

async function addStockType(name, averageWeight){
  const Query = await mysqlInsert(
    'INSERT INTO StockTypes (name, averageWeight) VALUES (?,?)',
    [name, averageWeight]
  );
  if (Query){ //If Query was successfull (if not then error has already been printed to console)
    console.log('Added a New Stock Type: ', name);
    return true; //return true so that client can know Stock Type was added successfully
  }
  else {return false;} //return false so client can know Stock Type wasn't added
}

async function addNewDeliveries(data){
  let successful = true
  let Query;
  data.forEach(async(row) =>{
    let arrived = row.outDate+' 10:10:10'
    let driverID = 7;
    Query = await mysqlInsert(
      'INSERT INTO Deliveries (sendingFromStoreID, sendingToStoreID, stockType, numOfBags, driverID, deliveryDueDate, deliveryArrivedDate) VALUES (?,?,?,?,?,?,?)',
      [1, row.location, row.stock, row.quantity, driverID, row.outDate, arrived]
    );
    if (Query){ //If Query was successfull (if not then error has already been printed to console)
      console.log('Added a new Delivery: ', row.location, row.stock);
    }
    else {
      successful = false;
      console.log('Error with Delivery: ', row.location, row.stock);
    }
  });
  return successful; //return false so client can know Stock Type wasn't added
}

/*------------------------------------------------*\
    Getting data from the database
\*------------------------------------------------*/

async function getOutgoingDeliveries(isNull, today){
  if (isNull == 'true') { return await mysqlSelect('SELECT deliveryDueDate,deliveryArrivedDate,storeName,stockName,numOfBags,userName FROM Deliveries d LEFT JOIN Stores s ON d.sendingToStoreID = s.storeID LEFT JOIN Users ON driverID = userID LEFT JOIN StockTypes ON stockType = stockID WHERE d.deliveryArrivedDate IS NULL AND d.deliveryDueDate >= ? ORDER BY deliveryDueDate ASC',[today]);
  }else return await mysqlSelect('SELECT deliveryDueDate,deliveryArrivedDate,storeName,stockName,numOfBags,userName FROM Deliveries d LEFT JOIN Stores s ON d.sendingToStoreID = s.storeID LEFT JOIN Users ON driverID = userID LEFT JOIN StockTypes ON stockType = stockID WHERE d.deliveryArrivedDate IS NOT NULL AND d.deliveryDueDate >= ? ORDER BY deliveryDueDate ASC',[today]);
}

async function getStockTypes(){
  return await mysqlSelect('SELECT stockName FROM StockTypes');
}

async function getStockTypesWithIDs(){
  return await mysqlSelect('SELECT stockID, stockName FROM StockTypes');
}

async function getRegionList(){
  return await mysqlSelect('SELECT * FROM Regions');
}

async function getClusterList(){
  return await mysqlSelect('SELECT * FROM Clusters');
}

async function getClusterListByRegion(regionID){
  return await mysqlSelect('SELECT clusterName FROM Clusters');
}

async function getStoreList(){
  return await mysqlSelect('SELECT storeName FROM Stores');
}

async function getStoreListWithIDs(){
  return await mysqlSelect('SELECT storeID, storeName FROM Stores');
}

async function getStoreListByCluster(clusterID){
  return await mysqlSelect('SELECT * FROM Stores WHERE clusterID = ?',[clusterID]);
}

async function getStoreListByRegion(regionID){
  return await mysqlSelect('SELECT * FROM Stores s LEFT JOIN Clusters c ON c.clusterID = s.clusterID WHERE regionID = ?',[regionID]);
}

async function getEarliestDate(){
  return await mysqlSelect('SELECT MIN(deliveryArrivedDate) as earliestDate FROM Deliveries WHERE deliveryArrivedDate IS NOT NULL');
}

async function getLatestDate(){
  return await mysqlSelect('SELECT MAX(deliveryArrivedDate) as latestDate FROM Deliveries WHERE deliveryArrivedDate IS NOT NULL');
}

async function getStockTotals(dateFrom, dateTo){
  return await mysqlSelect('SELECT stockName,SUM(numOfBags) as totalStock,stockColour FROM Deliveries LEFT JOIN StockTypes ON stockType = stockID WHERE deliveryArrivedDate IS NOT NULL AND cast(deliveryArrivedDate as date) BETWEEN ? AND ? GROUP BY stockID',
  [dateFrom, dateTo]);
}

async function getBreakdownByStock(dateFrom, dateTo){
  return await mysqlSelect(
    'SELECT stockName, stockColour, MONTH(deliveryArrivedDate) AS StockMonth, SUM(numOfBags) AS TotalBags FROM Deliveries LEFT JOIN StockTypes ON stockType = stockID WHERE deliveryArrivedDate IS NOT NULL AND cast(deliveryArrivedDate as date) BETWEEN ? AND ? GROUP BY stockType, MONTH(deliveryArrivedDate) ORDER BY MONTH(deliveryArrivedDate) ASC, stockType ASC',
    [dateFrom, dateTo]);
}


// Exported Functions
module.exports = {
  //Add
  addStockType: addStockType,
  addNewDeliveries: addNewDeliveries,

  //Get
  getStockTypes: getStockTypes,
  getStockTypesWithIDs: getStockTypesWithIDs,
  getRegionList: getRegionList,
  getClusterList: getClusterList,
  getClusterListByRegion: getClusterListByRegion,
  getStoreList: getStoreList,
  getStoreListWithIDs: getStoreListWithIDs,
  getStoreListByCluster: getStoreListByCluster,
  getStoreListByRegion: getStoreListByRegion,
  getEarliestDate: getEarliestDate,
  getLatestDate: getLatestDate,
  getOutgoingDeliveries: getOutgoingDeliveries,
  getStockTotals: getStockTotals,
  getBreakdownByStock: getBreakdownByStock,
}
