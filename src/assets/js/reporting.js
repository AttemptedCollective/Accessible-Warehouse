// Variables and Global functions
const displayArea = document.getElementsByTagName('displayArea')[0];
const cardArea = document.getElementsByTagName('cardArea')[0];
const today = new Date().toISOString().slice(0, 19);

const templates = [
  {name: "Total Stock Distributed Over Time", chartType:"polarArea", options: ["date", "specificDate", "stock"], dataType:1, tableMode:false},
  {name: "Breakdown of Stock Distributed Over Time", chartType:"bar", options: ["date", "specificDate", "stock"], dataType:2, tableMode:false},
  {name: "Breakdown of Stock Distributed Over Time (Stacked)", chartType:"bar", options: ["date", "specificDate", "stock"], dataType:2, tableMode:false}
];

const cardSettings = [
  {title:"Outbound Stock Totals - Live", chartType:"pie", cardType:1, area:cardArea},
  {title:"Outbound Stock Totals - Expected", chartType:"bar", cardType:2, area:cardArea},
  {title:"Outbound Stock Totals - This Month So Far", chartType:"polarArea", cardType:3, area:cardArea},
];

let stockNames = [];

function monthNumToName(monthnum) {
  let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return months[monthnum - 1] || '';
}

// Generic widgit Functions
// These functions will be use to populate and create widgits
async function createWidgitsForDashboard(numOfWidgits) {
  let listOfStockTypes = await clientGetListOfStockTypes();
  let listOfAreas = await clientGetAreaList();
  let listOfStores = await clientGetStoreList();
  let earliestDate = await clientGetEarliestDate();
  let latestDate = await clientGetLatestDate();

  for (var i = 0; i < numOfWidgits; i++) {
    console.log("Creating Widgit: ", i);
    listOfWidgits[i] = new Widgit(displayArea, templates, listOfStockTypes, listOfAreas, listOfStores, earliestDate, latestDate);
  }
}

//Card Creation
async function createCards() {
  listOfCards[0] = new Card(cardSettings[0].title, chartType[0].chartType, cardSettings[0].cardType, cardSettings[0].area);
  listOfCards[1] = new Card(cardSettings[1].title, chartType[1].chartType, cardSettings[1].cardType, cardSettings[1].area);
  listOfCards[2] = new Card(cardSettings[2].title, chartType[2].chartType, cardSettings[2].cardType, cardSettings[2].area);
}

// Code to be run on load
Chart.defaults.global.maintainAspectRatio = false;
let listOfWidgits = new Array(Widgit);
let listOfCards = new Array(Card);

createWidgitsForDashboard(1);
createCards();
