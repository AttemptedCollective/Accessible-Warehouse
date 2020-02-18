// Variables and Global functions
const displayArea = document.getElementsByTagName('displayArea')[0];
const today = new Date().toISOString().slice(0, 19);

// Server Functions
// ADD
async function addStockType(stock_name, average_weight) {
  let url = '/api/addStockType?stock_name=' + stock_name + '&average_weight=' + average_weight;
  const fetchOptions = {
    credentials: 'same-origin',
    method: 'POST',
  };
  await fetch(url, fetchOptions).then(function(response) {
    if (!response.ok) { // This will run if the server api didn't respond or had a problem like 404 etc.
      throw Error(response.statusText);
    }
    else { // If no problems fetching, then unpack the response
      return response.text();
    }
  }).then(function(response){
    if (response=="true"){
        console.log("added stock");
    }
    else{
      alert('Could not add to database');
    }
  })
  .catch(function(error) {
    console.log('Fetch problem: \n', error);
  });
}

async function addNewDelivery(fromLocation, toLocation, stockType, numOfBags, driverID, deliveryDueDate) {
  let url = '/api/addNewDelivery?fromLocation=' + fromLocation + '&toLocation=' + toLocation + '&stockType=' + stockType + '&numOfBags=' + numOfBags + '&driverID=' + driverID + '&deliveryDueDate=' + deliveryDueDate;
  const fetchOptions = {
    credentials: 'same-origin',
    method: 'POST',
  };
  await fetch(url, fetchOptions).then(function(response) {
    if (!response.ok) { // This will run if the server api didn't respond or had a problem like 404 etc.
      throw Error(response.statusText);
    }
    else { // If no problems fetching, then unpack the response
      return response.text();
    }
  }).then(function(response){
    if (response=="true"){
        console.log("added delivery");
    }
    else{
      alert('Could not add to database');
    }
  })
  .catch(function(error) {
    console.log('Fetch problem: \n', error);
  });
}

//GET
async function getListOfStockTypes() {
    const fetchOptions = {
      credentials: 'same-origin',
      method: 'GET',
    };
    response = await fetch('/api/getStockTypes', fetchOptions);
    if (!response.ok) {
      console.log(response.status);
      return;
    }
    data = await response.json();
    if (data.length == 0) {
      return;
    }
    let formattedData = [];
    data.forEach(stock => {
      formattedData.push(stock.stockName);
    })
    return formattedData;
}

async function getAreaList() {
  const fetchOptions = {
    credentials: 'same-origin',
    method: 'GET',
  };
  response = await fetch('/api/getAreaList', fetchOptions);
  if (!response.ok) {
    console.log(response.status);
    return;
  }
  data = await response.json();
  if (data.length == 0) {
    return;
  }
  let formattedData = [];
  data.forEach(area => {
    formattedData.push(area.areaName);
  })
  return formattedData;
}

async function getStoreList() {
  const fetchOptions = {
    credentials: 'same-origin',
    method: 'GET',
  };
  response = await fetch('/api/getStoreList', fetchOptions);
  if (!response.ok) {
    console.log(response.status);
    return;
  }
  data = await response.json();
  if (data.length == 0) {
    return;
  }
  let formattedData = [];
  data.forEach(location => {
    formattedData.push(location.locationName);
  })
  return formattedData;
}

//Widgit Creation
async function createWidgitsForDashboard(numOfWidgits) {
  let listOfStockTypes = await getListOfStockTypes();
  let listOfAreas = await getAreaList();
  let listOfStores = await getStoreList();

  for (var i = 0; i < numOfWidgits; i++) {
    listOfWidgits[i] = new WarehouseWidgit(displayArea, listOfStockTypes, listOfAreas, listOfStores);
  }
}

//Functions to be run on load
let listOfWidgits = new Array(WarehouseWidgit);
createWidgitsForDashboard(1);
