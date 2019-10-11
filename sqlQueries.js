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
    console.log("\x1b[31mSQL Failure:\n\x1b[37m%s\x1b[0m",error);//catch SQL errors and print to console in colour
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
    console.log("\x1b[31mSQL Failure:\n\x1b[37m%s\x1b[0m",error); //catch SQL errors and print to console in colour
    return false; //return false as there was an SQL error
  }
}

async function addUser(name, accessLevel, driverType){
  const Query = await mysqlInsert(
    'INSERT INTO User (name, accessLevel, driverType) VALUES (?,?,?)',
    [name, accessLevel, driverType]
  );
  if (Query){ //If Query was successfull (if not then error has already been printed to console)
    console.log('\x1b[33mAAdded a New User (%s)\x1b[0m', name);
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
    console.log('\x1b[33mAAdded a New Stock Type (%s)\x1b[0m', name);
    return true; //return true so that client can know Stock Type was added successfully
  }
  else {return false;} //return false so client can know Stock Type wasn't added
}
