//Constants and functions used to simplify GET/ADD Requests
const getFetchOptions = {
    credentials: 'same-origin',
    method: 'GET',
};

const getPostOptions = {
    credentials: 'same-origin',
    method: 'POST',
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

async function clientGetListOfStockTypesWithIDs() {
    response = await fetch('/api/getStockTypesWithIDs', getFetchOptions);
    if (!response.ok) {
      console.log(response.status);
      return;
    }
    data = await response.json();
    if (data.length == 0) {
      return;
    }
    return data;
}

async function clientGetRegionList() {
    response = await fetch('/api/getRegionList', getFetchOptions);
    if (!response.ok) {
      console.log(response.status);
      return;
    }
    data = await response.json();
    if (data.length == 0) {
      return;
    }
    let formattedData = [];
    data.forEach(region => {
      formattedData.push(region.regionName);
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
    data.forEach(store => {
        formattedData.push(store.storeName);
    })
    return formattedData;
}

async function clientGetStoreListWithIDs() {
    response = await fetch('/api/getStoreListWithIDs', getFetchOptions);
    if (!response.ok) {
        console.log(response.status);
        return;
    }
    data = await response.json();
    if (data.length == 0) {
        return;
    }
    let formattedData = [];
    data.forEach(store => {
        formattedData.push(store.storeName);
    })
    return data;
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
        {title:"Location", field:"storeName"},
        {title:"Stock Type", field:"stockType"},
        {title:"Quantity", field:"stockNum"},
        {title:"Delivery Date", field:"dueDate"},
        {title:"Delivery Arrived Date", field:"arrivedDate"},
        {title:"Delivery Driver", field:"userName"}
    ];

    let tableData = [];

    
    if (data != undefined || data != null) {
        data.forEach(row => {               
            let dataRow = {storeName:row.storeName, stockType:row.stockName, stockNum:row.numOfBags, dueDate:row.deliveryDueDate.slice(0,10), userName:row.userName}
            if (row.deliveryArrivedDate == null) {
                dataRow.arrivedDate = "N/A"
            } else dataRow.arrivedDate = row.deliveryArrivedDate.replace('T', ' ').slice(0,19);
            tableData.push(dataRow)
        });
    } else tableData = [{storeName:"N/A", stockType:"N/A", stockNum:"N/A", dueDate:"N/A", arrivedDate:"N/A", userName:"N/A"}]
    
    return [tableColumns, tableData]
}

async function clientAddNewDeliveries(data) {
    let stringData = JSON.stringify(data);
    let response = await fetch('/api/addNewDeliveries?stringData='+stringData, getPostOptions);
    return response;
}

//Card Specific GET Queries
