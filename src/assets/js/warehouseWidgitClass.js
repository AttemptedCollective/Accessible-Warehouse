const templates = [
    {name: "Deliveries - Completed", options: ["date", "specificDate", "stock"],  dataType:1},
    {name: "Deliveries - To be Completed", options: ["date", "specificDate", "stock"], dataType:5},
    {name: "Deliveries - Delivered Late", options: ["date", "specificDate", "stock"], dataType:5}
];

const templateData = {
    headers: ["Header 1", "Header 2", "Header 3", "Header 4"],
    rows: [
        ["Test 1", "Test 2", "Test 3", "Test 4"],
        ["Test 1", "Test 2", "Test 3", "Test 4"],
        ["Test 1", "Test 2", "Test 3", "Test 4"]
    ]
}

class WarehouseWidgit {
      constructor(parent, listOfStockTypes, listOfAreas, listOfStores) {
        this.listOfStockTypes = listOfStockTypes;
        this.listOfAreas = listOfAreas;
        this.listOfStores = listOfStores;
        this.currentIndex = 0;

        //Create the Widgit Element and append to given element
        this.widgit = document.createElement("div");
        parent.appendChild(this.widgit);
        this.widgit.classList.add('widgitArea');

        //Create the Select Element for changing Widgit Type
        this.topOptionsContainer = document.createElement("div");
        this.topOptionsContainer.classList.add('topOptionsContainer');
        this.widgit.appendChild(this.topOptionsContainer);
        this.select = document.createElement("select");
        this.topOptionsContainer.appendChild(this.select);
        this.select.classList.add("ui", "dropdown", 'reportSelect');
        templates.forEach(template => {
            let opt = document.createElement("option");
            opt.value= template.name
            opt.innerHTML = template.name;
            this.select.appendChild(opt);
        });
        this.select.addEventListener('change', async(event) => {
            this.destroyOptionsArea();
            this.updateTypeAndOptions();
            this.createTable();
        });
        $('.ui.dropdown.reportSelect').dropdown();
        this.storeAreaButton = document.createElement("button");
        this.storeAreaButton.classList.add("ui", "basic","button");
        this.storeAreaButton.innerText = "Filter By Areas";
        this.storeAreaButton.value = "area";
        this.topOptionsContainer.appendChild(this.storeAreaButton);

        //Area Selection
        this.areaSelect = document.createElement("select");
        this.areaSelect.classList.add("ui", "dropdown", "areaSelect");
        let areaOpt = document.createElement("option");
        areaOpt.value= "all";
        areaOpt.innerHTML = "All Areas";
        this.areaSelect.appendChild(areaOpt);
        this.listOfAreas.forEach(area => {
            let opt = document.createElement("option");
            opt.value= area
            opt.innerHTML = area;
            this.areaSelect.appendChild(opt);
        });
        $('.ui.dropdown.areaSelect').dropdown();
        this.topOptionsContainer.appendChild(this.areaSelect);
        $('.ui.dropdown.areaSelect').dropdown();

        //Store Selection
        this.storeSelect = document.createElement("select");
        this.storeSelect.classList.add("ui", "dropdown", "storeSelect", "hidden");
        let storeOpt = document.createElement("option");
        storeOpt.value= "all";
        storeOpt.innerHTML = "All Stores";
        this.areaSelect.appendChild(areaOpt);
        this.listOfStores.forEach(store => {
            let opt = document.createElement("option");
            opt.value= store
            opt.innerHTML = store;
            this.storeSelect.appendChild(opt);
        });
        $('.ui.dropdown.storeSelect').dropdown();
        this.topOptionsContainer.appendChild(this.storeSelect);
        $('.ui.dropdown.storeSelect').dropdown();


        //Create Table Area
        this.tableArea = document.createElement("div");
        this.tableArea.classList.add("tableArea");
        this.table = document.createElement("table");
        this.table.classList.add("ui", "celled", "striped", "table");
        this.tableArea.appendChild(this.table);
        this.widgit.appendChild(this.tableArea);

        //Create Options Area
        this.optionsContainer = document.createElement("div");
        this.optionsContainer.classList.add("optionsContainer");
        this.widgit.appendChild(this.optionsContainer);

        //Set chartType and create Options Area
        templates.forEach(template => {
            if (template.name == this.select.value){
                this.dataType = template.dataType
                this.chartOptions = template.options;
                this.updateOptionsArea();
                this.linkOptions();
                this.chosenOptions = this.updateChosenOptions();
            }
        });

        $('.ui.selection').dropdown();
        this.createTable();
        $('.ui.selection').dropdown();
    }

    //Basic Set Functions


    //Get Functions
    async getFormattedData() {
        let formattedData = {
          headers: [],
          rows: []
        };
        let fetchOptions;
        let response;
        let data;
        let range;
        switch(this.dataType){
            case 1:
                fetchOptions = {
                    credentials: 'same-origin',
                    method: 'GET',
                };
                response = await fetch('/api/getDeliveryReceipts?startIndex='+this.currentIndex+'&numberOfRecords='+10, fetchOptions);
                if (!response.ok) {
                    console.log(response.status);
                    return;
                }
                data = await response.json();
                if (data.length == 0) {
                    return;
                }
                formattedData.headers = ['Location Name', 'Stock Type', 'Number of Bags', 'Date Arrived', 'Time Arrived', 'Driver Name'];
                data.forEach(row => {
                  let formattedRow = [row.locationName, row.stockName, row.numOfBags, row.deliveryArrivedDate.slice(0, 10), row.deliveryArrivedDate.slice(11, 16), row.userName]
                  formattedData.rows.push(formattedRow);
                });
                return formattedData;
            default:
                return templateData;
        }
    }

    //Table Functions

    async createTable() {
        let data =  await this.getFormattedData();
        console.log(data);
        
        console.log("creating table");
        

        //Create and Append Headers
        let thead = document.createElement("thead")
        let theadRow = document.createElement("tr")
        thead.appendChild(theadRow);
        //this.table.appendChild(thead);
        data.headers.forEach(header => {
            let th = document.createElement("th");
            th.innerText = header;
            theadRow.appendChild(th);
        })

        //Create and Append Rows of data
        let tbody = document.createElement("tbody");
        //this.table.appendChild(tbody);
        data.rows.forEach(row => {
            let tr = document.createElement("tr");
            row.forEach(dataEntry => {
                let td = document.createElement("td");
                td.innerText = dataEntry;
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        })

        //Create and Append Footer
        let tfoot = document.createElement("tfoot");
        //this.table.appendChild(tfoot);
        let trFoot = document.createElement("tr");
        tfoot.appendChild(trFoot);
        let thFoot = document.createElement("th");
        trFoot.appendChild(thFoot);
        thFoot.setAttribute("colspan", data.headers.length)
        let footerMenu = document.getElementsByClassName("footerMenu")[0];
        thFoot.appendChild(footerMenu)
        console.log("Checking IF Statement");
        
        if (!this.table.firstChild) {
            console.log("No Children");
            this.table.appendChild(thead);
            this.table.appendChild(tbody);
            this.table.appendChild(tfoot);
        }
        else {            
            console.log("Do Something");
            console.log(thead, tbody, tfoot);
            
            this.table.replaceChild(thead, this.table.childNodes[0]);
            this.table.replaceChild(tbody, this.table.childNodes[1]);
            this.table.replaceChild(tfoot, this.table.childNodes[2]);
        }
    }

    //Other Funcitons
    updateTypeAndOptions() {
        templates.forEach(template => {
            if (template.name == this.select.value){
                this.updateOptionsArea();
                this.linkOptions();
                this.chosenOptions = this.updateChosenOptions();
            }
        });
        this.createTable();
    }

    increaseCurrentIndex(){
        this.currentIndex += 10;
    }

    decreaseCurrentIndex(){
        if(this.currentIndex != 0) this.currentIndex -= 10;
    }

    destroyOptionsArea() {
        while (this.optionsContainer.hasChildNodes()) this.optionsContainer.removeChild(this.optionsContainer.firstChild);
    }

    convertDate() {
      let range = [];
      switch(this.chosenOptions[0]){
            case "Year":
                let year = this.chosenOptions[1].slice(0,4);
                range = [year+"-01-01", year+"-12-31"]
                return range;
            case "Month":
                let month = this.chosenOptions[1].slice(0,7);
                range = [month+"-01", month+"-31"]
                return range;
            case "Week":
                let weekYear = parseInt(this.chosenOptions[1].slice(0,4));
                let weekNumber = parseInt( this.chosenOptions[1].slice(6,8));
                let date = new Date(weekYear, 0, 1 + (weekNumber - 1) * 7);
                let dayOfWeek = date.getDay();
                let ISOweekStart = date;
                let ISOweekEnd = new Date(weekYear, 0, 1 + (weekNumber - 1) * 7);
                if (dayOfWeek <= 4) {
                    ISOweekStart.setDate(date.getDate() - date.getDay() + 1);
                }
                else {
                    ISOweekStart.setDate(date.getDate() + 8 - date.getDay());
                }
                ISOweekEnd.setDate(ISOweekStart.getDate() + 6);
                range = [ISOweekStart.toISOString().slice(0,10), ISOweekEnd.toISOString().slice(0,10)]
                return range;
            case "Day":
                range = [this.chosenOptions[1], this.chosenOptions[1]]
                return range;
                break;
            }
    }

    updateChosenOptions() {
        let chosenOptions = [];
        let optionsContainerChildren = this.optionsContainer.childNodes
        optionsContainerChildren.forEach(child => {
            if (typeof child.value === 'string') chosenOptions.push(child.value);
            else chosenOptions.push(child.childNodes[0].value);
        });

        return chosenOptions;
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    updateOptionsArea() {
        this.chartOptions.forEach(option => {
            switch(option){
                case "date":
                    let dateElement = document.createElement("select");
                    dateElement.classList.add("ui", "dropdown", "dateOption");
                    let dateOptions = ["Year", "Month", "Week", "Day"];
                    dateOptions.forEach(date => {
                        let opt = document.createElement("option");
                        opt.value= date
                        opt.innerHTML = date;
                        dateElement.appendChild(opt);
                    });
                    this.optionsContainer.appendChild(dateElement)
                    $('.ui.dropdown.dateOption').dropdown();
                    break;
                case "specificDate":
                    let specificDateElement = document.createElement("input");
                    specificDateElement.setAttribute("type", "date")
                    specificDateElement.value = today.slice(0,10);
                    this.optionsContainer.appendChild(specificDateElement)
                    specificDateElement.addEventListener('change', async() =>{
                        this.chosenOptions = this.updateChosenOptions();
                        this.setChartData(await this.getFormattedData());
                        this.updateChart();
                    });
                    break
                case "stock":
                    let stockElement = document.createElement("select");
                    stockElement.name = "stocks";
                    stockElement.classList.add("ui", "selection", "dropdown", "stockSelect");
                    stockElement.setAttribute("multiple", "")
                    let initialOpt = document.createElement("option");
                    initialOpt.value = "";
                    initialOpt.innerHTML = "All Stocks";
                    stockElement.appendChild(initialOpt);
                    this.listOfStockTypes.forEach(stock => {
                        let opt = document.createElement("option");
                        opt.value = stock;
                        opt.innerHTML = stock;
                        stockElement.appendChild(opt);
                    });
                    $('.ui.selection').dropdown();
                    this.optionsContainer.appendChild(stockElement);
                    $('.ui.selection').dropdown();
                    this.optionsContainer.childNodes[2].addEventListener('click', async()=>{
                        await this.sleep(5)
                        let selectElements = this.optionsContainer.childNodes[2].childNodes;
                        let menu;
                        selectElements.forEach(ele => {
                            if (ele.classList.contains("menu")) {
                                menu = ele.childNodes;
                            }
                        });

                        let isActive = false;
                        let searchedStock = []
                        menu.forEach(stockOption => {
                            if (stockOption.classList == 'item active filtered'){
                                searchedStock.push(stockOption.innerHTML)
                                isActive = true;
                            }
                        });

                        if (!isActive) {
                            this.chosenStock = this.listOfStockTypes;
                            if (!this.firstClick) {
                                this.updateChart();
                                this.firstClick = true;
                            }
                        } else {
                            this.chosenStock = searchedStock;
                            this.updateChart();
                            this.firstClick = false;
                        }
                    });
                    break;
            }
        });
    }

    linkOptions() {
        if (this.chartOptions[0] == "date" && this.chartOptions[1] == "specificDate") {
            let optionElements = this.optionsContainer.childNodes;
            optionElements[0].firstChild.addEventListener('change', () => {
                switch(optionElements[0].firstChild .value){
                    case "Month":
                        optionElements[1].setAttribute("type", "month");
                        break
                    case "Week":
                        optionElements[1].setAttribute("type", "week");
                        break
                    default:
                        optionElements[1].setAttribute("type", "date");
                        break
                }
                this.chosenOptions = this.updateChosenOptions();
            })
        }
    }
}
