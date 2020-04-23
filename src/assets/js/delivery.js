const today = new Date().toISOString().slice(0, 19);
const displayArea = document.getElementsByTagName('displayArea')[0];
let regionList = [];
let regionSelect = document.getElementById('regionSelect');
let newRowButton = document.getElementById('newRow');
let submitButton = document.getElementById('submitButton');
let stockData = {};
let stockParams = {};
let storeData = {};
let storeParams = {};
let templateStock = "";
let tableData = [{stock:"Stock Type", quantity:"0", location:"Location", outDate:moment(today.slice(0,10), "YYYY-MM-DD").format("DD/MM/YYYY")}]

async function updateRegionList(){
    let defaultRegion = elementFactory('option', {value: 'all'}, [], regionSelect);
    defaultRegion.innerHTML = "All Regions";
    regionList = await clientGetRegionList();
    regionList.forEach(region => {
        let opt = elementFactory('option', {value: region}, [], regionSelect);
        opt.innerHTML = region;
    });
}

async function updateStockParams(){
    stockParams = {};
    stockData = await clientGetListOfStockTypesWithIDs();
    stockData.forEach(row => {
        stockParams[row.stockName] = row.stockName
    });
}

async function updateStoreParams(){
    storeParams = {};
    storeData = await clientGetStoreListWithIDs();
    storeData.forEach(row => {
        storeParams[row.storeName] = row.storeName;
    });
}

function getStockID(name) {
    let id = 0;
    stockData.forEach(row => {
        if (row.stockName == name) { 
            id = row.stockID;
        }
    })
    return id;
}

function getStoreID(name) {
    let id = 0;
    storeData.forEach(row => {
        if (row.storeName == name) { 
            id = row.storeID;
        }
    })
    return id;
}

regionSelect.addEventListener('change', async(event) => {
    updateStockParams();
    updateStoreParams();
});
$('.ui.dropdown').dropdown();

//Create Date Editor - Sourced from Tabulator http://tabulator.info/docs/4.6/edit
var dateEditor = function(cell, onRendered, success, cancel){
    //cell - the cell component for the editable cell
    //onRendered - function to call when the editor has been rendered
    //success - function to call to pass the successfuly updated value to Tabulator
    //cancel - function to call to abort the edit and return to a normal cell

    //create and style input
    var cellValue = moment(cell.getValue(), "DD/MM/YYYY").format("YYYY-MM-DD"),
    input = document.createElement("input");

    input.setAttribute("type", "date");
    input.setAttribute("min", today.slice(0,10))

    input.style.padding = "4px";
    input.style.width = "100%";
    input.style.boxSizing = "border-box";

    input.value = cellValue;

    onRendered(function(){
        input.focus();
        input.style.height = "100%";
    });

    function onChange(){
        if(input.value != cellValue){
            success(moment(input.value, "YYYY-MM-DD").format("DD/MM/YYYY"));
        }else{
            cancel();
        }
    }

    //submit new value on blur or change
    input.addEventListener("blur", onChange);

    //submit new value on enter
    input.addEventListener("keydown", function(e){
        if(e.keyCode == 13){
            onChange();
        }

        if(e.keyCode == 27){
            cancel();
        }
    });

    return input;
};

updateRegionList();
updateStockParams();
updateStoreParams();

// elementFactory
let table = new Tabulator("#new-delivery-table", {
    layout:"fitColumns",
    addRowPos:"bottom",
    pagination:"local",
    paginationSize:8,
    columns: [
        {title:"Stock Type", field:"stock", editor:"select", editorParams:{search:true, values:stockParams}},
        {title:"Stock Quantity", field:"quantity", editor:"number", editorParams:{min:"0", max:"10000"}, validator:"min:0"},
        {title:"Delivery Location", field:"location", editor:"select", editorParams:{search:true, values:storeParams}},
        {title:"Outbound Delivery Date", field:"outDate", sorter:"date", editor:dateEditor}
    ],
    data:tableData
})

newRowButton.addEventListener('click', () => {
    tableData.push({stock:"Stock Type", quantity:"0", location:"Location", outDate:moment(today.slice(0,10), "YYYY-MM-DD").format("DD/MM/YYYY")})
    table.setData(tableData);
});

submitButton.addEventListener('click', async() => {
    let data = table.getData();
    for (let index = 0; index < data.length; index++) {
        data[index].location = getStoreID(data[index].location);
        data[index].stock = getStockID(data[index].stock);
        data[index].outDate = moment(data[index].outDate, "DD/MM/YYYY").format("YYYY-MM-DD")
    }
    console.log(data);
    
    let submitted = await clientAddNewDeliveries(data);

    if (submitted) {
        tableData = [{stock:"Stock Type", quantity:"0", location:"Location", outDate:moment(today.slice(0,10), "YYYY-MM-DD").format("DD/MM/YYYY")}];
        table.setData(tableData);
        alert('Successfully Added Deliveries');
    } else {
        console.log('error');
    }
});