// Variables and Global functions
const displayArea = document.getElementsByTagName('displayArea')[0];
const cardArea = document.getElementsByTagName('cardArea')[0];
const today = new Date().toISOString().slice(0, 19);
let stockNames = [];

const templates = [
  {name: "Outgoing Deliveries - Waiting ", chartType:"bar", options: ["date", "specificDate", "stock"], dataType:2, tableMode:true}
];

function monthNumToName(monthnum) {
  let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return months[monthnum - 1] || '';
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

async function getEarliestDate() {
  const fetchOptions = {
    credentials: 'same-origin',
    method: 'GET',
  };
  response = await fetch('/api/getEarliestDate', fetchOptions);
  if (!response.ok) {
    console.log(response.status);
    return;
  }
  data = await response.json();
  if (data.length == 0) {
    return;
  }
  return data.earliestDate;
}

async function getLatestDate() {
  const fetchOptions = {
    credentials: 'same-origin',
    method: 'GET',
  };
  response = await fetch('/api/getLatestDate', fetchOptions);
  if (!response.ok) {
    console.log(response.status);
    return;
  }
  data = await response.json();
  if (data.length == 0) {
    return;
  }
  return data.latestDate;
}

// Generic widgit Functions
// These functions will be use to populate and create widgits
async function createWidgitsForDashboard(numOfWidgits) {
  let listOfStockTypes = await getListOfStockTypes();
  let listOfAreas = await getAreaList();
  let listOfStores = await getStoreList();
  let earliestDate = await getEarliestDate();
  let latestDate = await getLatestDate();

  for (var i = 0; i < numOfWidgits; i++) {
    console.log("Creating Widgit: ", i);
    listOfWidgits[i] = new Widgit(displayArea, templates, listOfStockTypes, listOfAreas, listOfStores, earliestDate, latestDate);
  }
}

//Card Creation
async function createCards() {
  listOfCards[0] = new Card("Outbound Stock Totals - Live", 1, cardArea);
  listOfCards[1] = new Card("Outbound Stock Totals - Expected", 2, cardArea);
  listOfCards[2] = new Card("Outbound Stock Totals - This Month So Far", 3, cardArea);
}

// Code to be run on load
Chart.defaults.global.maintainAspectRatio = false;
let listOfWidgits = new Array(Widgit);
let listOfCards = new Array(Card);

createWidgitsForDashboard(1);
createCards();
