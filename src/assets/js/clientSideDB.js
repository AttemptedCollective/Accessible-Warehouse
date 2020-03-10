//Constants and functions used to simplify GET/ADD Requests
const getFetchOptions = {
    credentials: 'same-origin',
    method: 'GET',
};

async function checkResponse(response) {
    if (!response.ok) {
        console.log(response.status);
        return;
    }
    let data = await response.json();
        if (data.length == 0) {
        return;
    } 

    return data;
}


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

    if (chosenStock.length == 0) {
        chosenStock = await clientGetListOfStockTypes();
    }
    data.forEach(element => {    
        if (chosenStock.includes(element.stockName)) {  
            formattedData.labels.push(element.stockName);
            formattedData.datasets[0].data.push(element.totalStock);
            formattedData.datasets[0].backgroundColor.push(element.stockColour.slice(0, -1)+", 0.75)");
        }
    });
    let options = {
        responsive: "true",
        legend: {
            posistion: 'top'
        }
    }
    return [formattedData, options];
}

//
async function clientListOfOutgoingDeliveries(isNull) {
    let response = await fetch('/api/getOutgoingDeliveries?isNull='+isNull+'&today='+today.slice(0,10), getFetchOptions);
    let data = await checkResponse(response);

    let tableColumns = [
        {title:"Location", field:"locationName"},
        {title:"Stock Type", field:"stockType"},
        {title:"Quantity", field:"stockNum"},
        {title:"Delivery Date", field:"dueDate"},
        {title:"Delivery Driver", field:"userName"}
    ];

    let tableData = [];

    data.forEach(row => {
        tableData.push({locationName:row.locationName, stockType:row.stockName, stockNum:row.numOfBags, dueDate:row.deliveryArrivedDate.slice(0,10), userName:row.userName})
    });

    if (tableData.length == 0) tableData = [{locationName:"N/A", stockType:"N/A", stockNum:"N/A", dueDate:"N/A", userName:"N/A"}]
    
    return [tableColumns, tableData]
}

//Card Specific GET Queries
