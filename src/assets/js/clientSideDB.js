//Constants
const getFetchOptions = {
    credentials: 'same-origin',
    method: 'GET',
};

//General GET Queries
async function clientGetListOfStockTypes() {
    response = await fetch('/api/getStockTypes', getFetchOptions);
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

async function clientGetAreaList() {
    response = await fetch('/api/getAreaList', getFetchOptions);
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
  
async function clientGetStoreList() {
    response = await fetch('/api/getStoreList', getFetchOptions);
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

async function clientGetEarliestDate() {
    response = await fetch('/api/getEarliestDate', getFetchOptions);
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

async function clientGetLatestDate() {
    response = await fetch('/api/getLatestDate', getFetchOptions);
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
  
//Widgit and Card Shared GET Queries
async function clientGetStockTotals(formattedData, chosenStock, range) {
    let response = await fetch('/api/getStockTotals?dateFrom='+range[0]+'&dateTo='+range[1], getFetchOptions);
    if (!response.ok) {
        console.log(response.status);
        return;
    }
    let data = await response.json();
        if (data.length == 0) {
        return;
    }

    data.forEach(element => {
        if (chosenStock.includes(element.stockName || chosenStock == [])) {
            formattedData.labels.push(element.stockName);
            formattedData.datasets[0].data.push(element.totalStock);
            formattedData.datasets[0].backgroundColor.push(element.stockColour.slice(0, -1)+", 0.75)");
        }
    });
    let options = {
        responsive: "true"
    }
    return formattedData, options;
}

//Card Specific GET Queries

//Exports
module.exports = {
    //ADD
      
    //Generic GET
    clientGetListOfStockTypes: clientGetListOfStockTypes,
    clientGetAreaList: clientGetAreaList,
    clientGetStoreList: clientGetStoreList,
    clientGetEarliestDate: clientGetEarliestDate,
    clientGetLatestDate: clientGetLatestDate,

    //Shared GET
    clientGetStockTotals: clientGetStockTotals
  }